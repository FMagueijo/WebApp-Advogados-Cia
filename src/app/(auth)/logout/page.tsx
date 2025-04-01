// app/auth/signout/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
    const router = useRouter();

    useEffect(() => {
        const handleSignOut = async () => {
            await signOut({
                redirect: false,
                callbackUrl: "/goodbye",
            });
            router.push("/goodbye");
        };

        handleSignOut();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">A sair da conta...</h1>
                <div className="animate-pulse rounded-full h-12 w-12 border-5 border-(--submit-color) mx-auto"></div>
            </div>
        </div>
    );
}