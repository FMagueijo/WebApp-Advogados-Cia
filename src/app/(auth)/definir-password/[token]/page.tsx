"use client";
import type { Metadata } from "next";
import * as X from "@/components/xcomponents";
import { GetToken } from "./actions";



export default function Login() {

  const tok = GetToken();

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col gap-8 w-full lg:w-xl items-center justify-center grid-flow-row">
        {/* Logo */}
        <X.Container className="w-full items-center justify-center">
          <img src="/images/brand/logo.svg" className="h-max" alt="Logo" />
        </X.Container>

        {/* Form container */}
        <form className="w-full">
          <X.Container className="w-full">
            {/* Título e Divider */}
            <h2 className="text-lg font-semibold text-left">Definir Password</h2>
            <X.Divider />
            {/* Campos de Password */}
            <X.Field required type="password" placeholder="Password" name="password" />
            <X.Field required type="password" placeholder="Confirmar Password" name="confirmPassword" />
            <X.Submit>Definir Password</X.Submit>
          </X.Container>
        </form>
      </div>
    </div>
  );
}