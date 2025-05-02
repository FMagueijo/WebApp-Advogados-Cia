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

    const casos = await prisma.caso.findMany({
      where,
      orderBy,
      select: {
        id: true,
        processo: true,
        resumo: true,
        criado_em: true,
        cliente: { select: { nome: true } },
        user_id: true,
        cliente_id: true,
        descricao: true
      }
    });

    // Simular campo 'estado' com base na descrição (ou outro critério se tiveres)
    const transformados = casos.map(c => ({
      id: c.id,
      processo: c.processo,
      assunto: c.resumo,
      criadoPor: `[${c.user_id}] ${c.cliente.nome}`,
      estado: c.descricao?.includes("Fechado") ? "Fechado" : "Aberto" // Ajusta conforme tua lógica real
    }));

    return transformados;
  } catch (error) {
    console.error("Erro ao buscar casos:", error);
    throw new Error("Falha ao buscar casos");
  }
}
