"use server"

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function hasNotification(user: string | number | null) {

    try {
        const count = await prisma.notificacaoRecebida.count({
            where: {
                user_id: Number(user),
                lida: false,
            },
        });
        console.log("Notificações não lidas:", count);
        return count > 0; // Retorna true se houver notificações não lidas
    } catch (error) {
        console.error("Erro ao verificar notificações:", error);
        throw new Error("Falha ao verificar notificações");
    }

} 