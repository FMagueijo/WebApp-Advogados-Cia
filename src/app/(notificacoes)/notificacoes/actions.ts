'use server';

import prisma from '@/lib/prisma';

export async function fetchNotificacoes(
    user: string | number | null,
    limit: number | null = null,
) {
    try {

        // Primeiro buscamos os casos
        const nots = await prisma.notificacaoRecebida.findMany({
            select: {
                id: true,
                lida: true,
                notificacao: true
            },
            where: {
                user_id: Number(user)
            },
            orderBy: {
                notificacao: {
                    criado_em: 'desc'
                }
            },
            ...(limit != null && { take: limit }),
        });


        return nots;
    } catch (error) {
        console.error("Erro ao buscar notificacoes:", error);
        throw new Error("Falha ao buscar notificacoes");
    }
}

export async function marcarTodasComoLidas(user: string | number | null) {
    try {
        await prisma.notificacaoRecebida.updateMany({
            where: {
                user_id: Number(user),
                lida: false
            },
            data: {
                lida: true
            }
        });
    } catch (error) {
        console.error("Erro ao marcar notificacoes como lidas:", error);
        throw new Error("Falha ao marcar notificacoes como lidas");
    }
}

export async function limparNotificacoes(user: string | number | null) {
    try {
        await prisma.notificacaoRecebida.deleteMany({
            where: {
                user_id: Number(user)
            }
        });
    } catch (error) {
        console.error("Erro ao limpar notificacoes:", error);
        throw new Error("Falha ao limpar notificacoes");
    }
}