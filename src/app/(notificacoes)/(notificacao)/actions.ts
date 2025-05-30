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


export async function fetchNotificacao(
    user: string | number | null,
    id: string | number | null,
) {
    try {

        // Primeiro buscamos os casos
        const nots = await prisma.notificacaoRecebida.findFirst({
            select: {
                lida: true,
                notificacao: true
            },
            where: {
                user_id: Number(user),
                notificacao: {
                    id: Number(id)
                }
            },
            orderBy: {
                notificacao: {
                    criado_em: 'desc'
                }
            },
        });


        return nots;
    } catch (error) {
        console.error("Erro ao buscar notificacoes:", error);
        throw new Error("Falha ao buscar notificacoes");
    }
}

export async function marcarComoLida(id: string | number | null, user: string | number | null) { 
    try {
        await prisma.notificacaoRecebida.update({
            where: {
                id: Number(id),
                user_id: Number(user)
            },
            data: {
                lida: true
            }
        });
        console.log("Notificação marcada como lida:", id);
    } catch (error) {
        console.error("Erro ao marcar notificacao como lida:", error);
        throw new Error("Falha ao marcar notificacao como lida");
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



export async function apagarNotificacoes(user: string | number | null, id: string | number | null) {
    try {
        await prisma.notificacaoRecebida.delete({
            where: {
                user_id: Number(user),
                notificacao: {
                    id: Number(id)
                }
            }
        });

    } catch (error) {
        console.error("Erro ao limpar notificacoes:", error);
        throw new Error("Falha ao limpar notificacoes");
    }
}