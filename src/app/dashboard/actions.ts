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
export async function getTotalColaboradores(): Promise<number> {
  try {
    const total = await prisma.user.count({
      where: {
        role_id: 2 // Filtra apenas usuários com role_id = 2 (colaboradores)
      }
    });
    return total;
  } catch (error) {
    console.error("Erro ao contar colaboradores:", error);
    throw new Error("Erro ao contar colaboradores");
  }
}
export async function getTotalClientes(): Promise<number> {
  try {
    const total = await prisma.cliente.count();
    return total;
  } catch (error) {
    console.error("Erro ao contar clientes:", error);
    throw new Error("Erro ao contar clientes");
  }
}
export type TopColaborador = {
  user_id: number;
  nome: string;
  count: number;
};

export type TopCliente = {
  cliente_id: number;
  nome: string;
  count: number;
};

export async function getTopColaborador(): Promise<TopColaborador> {
  try {
    const result = await prisma.$queryRaw`
      SELECT u.id as user_id, u.nome, COUNT(c.id) as count
      FROM utilizador u
      JOIN caso c ON u.id = c.user_id
      GROUP BY u.id, u.nome
      ORDER BY count DESC
      LIMIT 1
    `;
    
    return result[0] || { user_id: 0, nome: "Nenhum", count: 0 };
  } catch (error) {
    console.error("Erro ao buscar top colaborador:", error);
    throw new Error("Erro ao buscar top colaborador");
  }
}

export async function getTopCliente(): Promise<TopCliente> {
  try {
    const result = await prisma.$queryRaw`
      SELECT cl.id as cliente_id, cl.nome, COUNT(c.id) as count
      FROM cliente cl
      JOIN caso c ON cl.id = c.cliente_id
      GROUP BY cl.id, cl.nome
      ORDER BY count DESC
      LIMIT 1
    `;
    
    return result[0] || { cliente_id: 0, nome: "Nenhum", count: 0 };
  } catch (error) {
    console.error("Erro ao buscar top cliente:", error);
    throw new Error("Erro ao buscar top cliente");
  }
}

