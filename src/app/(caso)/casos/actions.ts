'use server';

import prisma from '@/lib/prisma';

export async function fetchCasos(
  filters: Record<string, any> = {},
  order: Record<string, boolean> = {}
) {
  try {
    const where: any = {};

    if (filters.estado) where.estado = filters.estado;

    const orderBy: any = [];
    for (const [key, value] of Object.entries(order)) {
      const prismaKey = {
        "ID": "id",
        "Processo": "processo",
        "Assunto": "resumo"
      }[key] || key;
      orderBy.push({ [prismaKey]: value ? "desc" : "asc" });
    }

    // Primeiro buscamos os casos
    const casos = await prisma.caso.findMany({
      where,
      orderBy,
      select: {
        id: true,
        processo: true,
        resumo: true,
        criado_em: true,
        estado:true,
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