"use client"

import * as X from "@/components/xcomponents";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        const formData = new FormData(e.currentTarget);

        try {
            const result = await signIn('credentials', {
                email: formData.get('Email'),
                password: formData.get('Password'),
                redirect: false
            });

            console.log(result);

            if (result?.error) {
                throw new Error(result.error);
            }

            if (!result?.ok) {
                throw new Error('Falha na autenticação');
            }

            window.location.href = '/';

        } catch (err) {
            setError(err ? (err as Error).message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full lg:w-xl items-center justify-center grid-flow-row">
            <X.Container className="w-full items-center justify-center">
                <img src="/images/brand/logo.svg" className="h-max" />
            </X.Container>

            <form onSubmit={handleSubmit} className="w-full">
                <X.Container className="w-full">
                    {error && (
                        <X.ErrorBox className="w-full" visible={!!error} onClose={() => { setError(null); } }> 
                            {error}
                        </X.ErrorBox>
                    )}
                    <X.Field
                        required
                        type="email"
                        placeholder="Email"
                        name="Email"
                    />
                    <X.Field
                        required
                        type="password"
                        placeholder="Password"
                        name="Password"
                        showHideToggle
                    />
                    <X.Submit>
                        {isLoading ? 'Autenticando...' : 'Login'}
                    </X.Submit>
                </X.Container>
            </form>
        </div>
    );
}