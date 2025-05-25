'use server'

import  prisma  from "@/lib/prisma";

export type CasoCount = {
  estado: string;
  count: number;
};

export type CasosStats = {
  estados: CasoCount[];
  total: number;
};

export async function getCasosStats(): Promise<CasosStats> {
  try {
    // Debug: Verifique todos os casos
    const todosCasos = await prisma.caso.findMany({
      include: {
        estado: true
      }
    });
    console.log("Todos os casos:", todosCasos);

    // Conta o total de casos
    const totalCasos = await prisma.caso.count();
    
    // Debug: Verifique todos os estados disponíveis
    const estados = await prisma.casoEstado.findMany();
    console.log("Estados disponíveis:", estados);

    // Agrupa casos por estado
    const casosPorEstado = await prisma.caso.groupBy({
      by: ['estado_id'],
      _count: {
        _all: true
      },
    });
    console.log("Casos por estado ID:", casosPorEstado);
    
    // Mapeia os resultados
    const estadosCount = casosPorEstado.map(item => {
      const estado = estados.find(e => e.id === item.estado_id);
      console.log(`Estado ID ${item.estado_id} encontrado:`, estado);
      return {
        estado: estado?.nome_estado || 'Desconhecido',
        count: item._count._all
      };
    });

    console.log("Resultado final:", estadosCount);

    return {
      estados: estadosCount,
      total: totalCasos
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas de casos:", error);
    throw new Error("Erro ao buscar estatísticas de casos");
  }
}