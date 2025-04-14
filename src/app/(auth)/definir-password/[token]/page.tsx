"use client";
import * as X from "@/components/xcomponents";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { changePassword, validateToken } from "./actions";
import { User } from "@prisma/client";

export default function Login() {
  const params = useParams();
  const token = params.token as string;
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    try {

      if (password !== confirmPassword) {
        throw new Error('As passwords não coincidem.');
      }

      await changePassword(password, user as User);

    } catch (err) {
      setError(err ? (err as Error).message : 'Erro desconhecido');
    } finally {
      
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      const form = e.target.form as HTMLFormElement;
      const password = form.password.value;
      const confirmPassword = form.confirmPassword.value;

      if (password !== confirmPassword) {
        setError("As passwords não coincidem.");
      } else {
        setError(null);
      }
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await validateToken(token);
        setIsValid(result.valid);
        if (!result.valid) {
          redirect("/404");
        }

        setUser(result.user as User);
      } catch (error) {
        console.error(error);
        setIsValid(false);
        redirect("/404");
      }
    };

    verifyToken();
  }, [token]);

  if (isValid === null) {
    return null;
  }

  if (!isValid) {
    return null; // The redirect will handle this
  }


  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col gap-8 w-full lg:w-xl items-center justify-center grid-flow-row">
        {/* Logo */}
        <X.Container className="w-full items-center justify-center">
          <img src="/images/brand/logo.svg" className="h-max" alt="Logo" />
        </X.Container>
        {/* Form container */}
        <form className="w-full" onSubmit={handleSubmit}>
          <X.Container className="w-full">
            {/* Título e Divider */}
            <div>
              <h2 className="text-lg font-semibold text-left">
                <span className="font-black">{user?.nome}</span> | Definir password
              </h2>
            </div>
            <X.Divider />
            {/* Campos de Password */}
            {error && (
              <X.ErrorBox className="w-full" visible onClose={() => setError(null)}>
                {error}
              </X.ErrorBox>
            )}
            <X.Field required type="password" placeholder="Password" name="password" showHideToggle onChange={onChange} />
            <X.Field required type="password" placeholder="Confirmar Password" name="confirmPassword" showHideToggle onChange={onChange}/>
            <X.Submit>Definir Password</X.Submit>
          </X.Container>
        </form>
      </div>
    </div>
  );
}