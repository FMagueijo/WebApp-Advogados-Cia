'use server';

import prisma from '@/lib/prisma';

export async function fetchEventos(
    filters: Record<string, any> = {},
    order: Record<string, boolean> = {},
    dataInicio: Date = new Date(),
    userId: number,
) {
    try {
        const where: any = {};

        if (filters.Titulo) where.titulo = filters.Titulo;
        if (filters.Descrição) where.descricao = filters.Descrição;
        const dataFim = new Date(dataInicio);
        dataFim.setDate(dataFim.getDate() + 4);
        dataFim.setHours(23, 59, 59, 999);
        where.data = {
            gte: dataInicio,
            lt: dataFim,
        };

        const orderBy: any = [];
        for (const [key, value] of Object.entries(order)) {
            const prismaKey = {
                "Data": "data",
                "Titulo": "titulo",
            }[key] || key;
            orderBy.push({ [prismaKey]: value ? "desc" : "asc" });
        }

        const eventos = await prisma.evento.findMany({
            where: {
                ...where,
                OR: [
                    // Caso 1: Está diretamente associado via user_id
                    { user_id: userId },

                    // Caso 2: Está como colaborador do evento
                    { users: { some: { id: userId } } },

                    // Caso 3: Está relacionado com algum caso do evento
                    { casos: { some: { user_id: userId } } },

                    // Caso 4: Evento global (sem users e sem casos)
                    {
                        AND: [
                            { users: { none: {} } },
                            { casos: { none: {} } },
                        ]
                    }
                ],
            },
            orderBy,
            select: {
                id: true,
                titulo: true,
                descricao: true,
                data: true,
            }
        });

        console.log(dataInicio);
        return eventos;
        // Primeiro buscamos os casos
        const casos = await prisma.caso.findMany({
            where,
            orderBy,
            select: {
                id: true,
                processo: true,
                resumo: true,
                criado_em: true,
                estado: true,
                user_id: true,  // Mantemos o user_id para buscar depois
                cliente: {
                    select: {
                        nome: true
                    }
                },
                descricao: true
            }
        });

        // Pegamos todos os user_ids distintos
        const userIds = [...new Set(casos.map(c => c.user_id))];

        // Buscamos os usuários correspondentes
        const usuarios = await prisma.user.findMany({
            where: {
                id: { in: userIds }
            },
            select: {
                id: true,
                nome: true
            }
        });

        // Criamos um mapa de id -> nome
        const usuarioMap = new Map(usuarios.map(u => [u.id, u.nome]));

        // Transformamos os resultados
        const transformados = casos.map(c => ({
            id: c.id,
            processo: c.processo,
            assunto: c.resumo,
            criadoPor: usuarioMap.get(c.user_id) || 'Desconhecido',
            cliente: c.cliente?.nome || 'Desconhecido',
            estado: c.estado.nome_estado,
            dataCriacao: c.criado_em
        }));

        return transformados;
    } catch (error) {
        console.error("Erro ao buscar casos:", error);
        throw new Error("Falha ao buscar casos");
    }
}