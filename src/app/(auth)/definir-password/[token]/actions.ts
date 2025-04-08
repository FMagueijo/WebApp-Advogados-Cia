
"use server";

import prisma from "@/lib/prisma";
import { useRouter } from "next/router"; // Importa o useRouter do Next.js

export function HandleLogin() {
    // Use o useRouter para acessar os parâmetros da rota
    const router = useRouter();
    const { token } = router.query; // Extraia o token da query
    console.log("Token from HandleLogin:", token); // Use the token to avoid unused variable error
}

export function GetToken(): string | undefined {
    const router = useRouter();
    const { token } = router.query;
    return typeof token === "string" ? token : undefined;
}

export async function isValidToken(token: string | undefined): Promise<boolean> {

    const tok = await prisma.tokenPass.findFirst({
        select: { token: true },
        where: { token },
    });

    return tok !== null; // Retorna true se o token for válido, false caso contrário
}