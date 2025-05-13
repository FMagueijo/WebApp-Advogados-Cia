// app/(colab)/colaboradores/actions.ts
'use server';

import prisma from '@/lib/prisma';

export async function toggleBloqueado(id: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { esta_bloqueado: true },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                esta_bloqueado: !user.esta_bloqueado,
            },
        });

        return updatedUser;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to toggle user bloqueado status: ' + error);
    }
}

export async function fetchColaboradores(
    filters: Record<string, any> = {},
    order: Record<string, boolean> = {}
) {
    console.log(filters);
    try {
        // Convert filters to Prisma where clause
        const where: any = {};

        if (filters.ID) where.id = Number(filters.ID);
        if (filters.Nome) where.nome = { contains: filters.Nome };
        if (filters.Email) where.email = { contains: filters.Email };
        if (filters.Estado) {
            switch (filters.Estado) {
                case "Ativo":
                    where.esta_bloqueado = false;
                    where.password_hash = { not: null };
                    break;
                case "Não Verificado":
                    where.password_hash = null;
                    break;
                case "Bloqueado":
                    where.esta_bloqueado = true;
                    break;
                default:
                    break;
            }

        }

        // Convert order to Prisma orderBy
        const orderBy: any = [];
        for (const [key, value] of Object.entries(order)) {
            const prismaKey = {
                "ID": "id",
                "Nome": "nome",
                "Email": "email"
            }[key] || key;
            orderBy.push({ [prismaKey]: value ? "desc" : "asc" });
        }

        const colabs = await prisma.user.findMany({
            orderBy,
            select: {
                id: true,
                nome: true,
                email: true,
                password_hash: true,
                esta_bloqueado: true,
                _count: {
                    select: {
                        casos: true
                    }
                },
                role: {  // This replaces the 'include'
                    select: {
                        role_id: true,
                        nome_role: true
                        // Include other role fields you need
                    }
                }
            },
            where: {
                ...where,
                role: {
                    nome_role: "colaborador"
                }
            }
        });

        return colabs.map(colab => ({
            ...colab,
            casosCount: colab._count?.casos || 0
        }));
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch colaboradores: ' + error);
    }
}