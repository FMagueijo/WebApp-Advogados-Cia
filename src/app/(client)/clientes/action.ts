'use server';

import prisma from '@/lib/prisma';

export async function fetchClientes(
  filters: Record<string, any> = {},
  order: Record<string, boolean> = {}
) {
  try {
  const where: any = {};

    if (filters.ID) where.id = Number(filters.ID);
    if (filters.Nome) where.nome = { contains: filters.Nome };
    if (filters.Email) where.email = { contains: filters.Email };
    if (filters.Telefone) where.telefone = { contains: filters.Telefone };

  const orderBy: any = [];
    for (const [key, value] of Object.entries(order)) {
      const prismaKey = {
        "ID": "id",
        "Nome": "nome",
        "Email": "email",
        "Telefone": "telefone",
        "Casos": "casos"
      }[key] || key;
      orderBy.push({ [prismaKey]: value ? "desc" : "asc" });
    }

    const clientes = await prisma.cliente.findMany({
      where,
      orderBy,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        codigoPostal: true,
        endereco: true,
        casos: {
          select: {
            id: true,
            estado: {
              select: {
                nome_estado: true
              }
            }
          }
        },
        dividas: {
          select: {
            valor: true
          }
        }
      }
    });

    return clientes.map(cliente => ({
      ...cliente,
      casosCount: cliente.casos.length,
      estado: cliente.casos.length > 0 ? cliente.casos[0].estado.nome_estado : 'Sem Casos',
      dividaTotal: cliente.dividas.reduce((sum, d) => sum + d.valor, 0)
    }));
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch clients: ' + error);
  }
}