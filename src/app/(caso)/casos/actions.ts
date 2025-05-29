'use server';

import prisma from '@/lib/prisma';

export async function fetchCasos(
  filters: Record<string, any> = {},
  order: Record<string, boolean> = {}
) {
  try {
    const where: any = {};

    if (filters.estado) {
      where.estado = {
        nome_estado: filters.estado
      };
    }

    const orderBy: any = [];
    for (const [key, value] of Object.entries(order)) {
      const prismaKey = {
        "ID": "id",
        "Processo": "processo",
        "Assunto": "resumo"
      }[key] || key;
      orderBy.push({ [prismaKey]: value ? "desc" : "asc" });
    }

    // Buscar casos com clientes e usuários
    const casos = await prisma.caso.findMany({
      where,
      orderBy,
      include: {
        estado: true,
        user: {
          select: {
            id: true,
            nome: true
          }
        },
        clientes: {
          include: {
            cliente: {
              select: {
                id: true,
                nome: true
              }
            }
          }
        }
      }
    });

    // Transformar os resultados
    const transformados = casos.map(c => ({
      id: c.id,
      processo: c.processo,
      assunto: c.resumo,
      criadoPor: c.user.nome,
      // Pegar o primeiro cliente associado (ou 'Desconhecido' se não houver)
      cliente: c.clientes[0]?.cliente.nome || 'Desconhecido',
      estado: c.estado.nome_estado,
      dataCriacao: c.criado_em,
      // Manter todos os clientes caso precise
      todosClientes: c.clientes.map(cc => cc.cliente)
    }));

    return transformados;
  } catch (error) {
    console.error("Erro ao buscar casos:", error);
    throw new Error("Falha ao buscar casos");
  }
}