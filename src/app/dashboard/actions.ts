'use server'

import prisma from "@/lib/prisma";

export type CasoCount = {
  estado: string;
  count: number;
};

export type CasosStats = {
  estados: CasoCount[];
  total: number;
};

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

export type MaiorDivida = {
  caso_id: number;
  clientes: any;
  valor_divida: number;
  titulo_caso: string;
};

export type FaturamentoStats = {
  valor_a_receber: number;
  total_pago: number;
};

export async function getCasosStats(): Promise<CasosStats> {
  try {
    const todosCasos = await prisma.caso.findMany({
      include: {
        estado: true
      }
    });

    const totalCasos = await prisma.caso.count();
    
    const estados = await prisma.casoEstado.findMany();

    const casosPorEstado = await prisma.caso.groupBy({
      by: ['estado_id'],
      _count: {
        _all: true
      },
    });
    
    const estadosCount = casosPorEstado.map(item => {
      const estado = estados.find(e => e.id === item.estado_id);
      return {
        estado: estado?.nome_estado || 'Desconhecido',
        count: item._count._all
      };
    });

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
        role_id: 2
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

    const res = await prisma.cliente.findFirst({
      select: {
        id: true,
        nome: true,
        _count: {
          select: {
            casos: true
          }
        }
      },
      orderBy: {
        casos: {
          _count: 'desc'
        }
      },
    });
    
    const topCliente: TopCliente = {
      cliente_id: res?.id || 0, // Provide a default value if result is null
      nome: res?.nome || '',    // Provide a default value if result is null
      count: res?._count.casos || 0
    };

    return topCliente || { cliente_id: 0, nome: "Nenhum", count: 0 };
  } catch (error) {
    console.error("Erro ao buscar top cliente:", error);
    throw new Error("Erro ao buscar top cliente");
  }
}

export async function getMaiorDivida(): Promise<MaiorDivida | null> {
  try {
    const casosComDividas = await prisma.caso.findMany({
      include: {
        clientes: true,
        dividas: {
          where: {
            pago: false
          }
        }
      }
    });

    const casosComTotalDivida = casosComDividas.map(caso => ({
      caso_id: caso.id,
      clientes: caso.clientes,
      titulo_caso: caso.resumo,
      valor_divida: caso.dividas.reduce((sum, divida) => sum + divida.valor, 0)
    })).filter(caso => caso.valor_divida > 0);

    if (casosComTotalDivida.length === 0) return null;

    // Ordena por maior dívida e pega o primeiro
    const maiorDivida = casosComTotalDivida.sort((a, b) => b.valor_divida - a.valor_divida)[0];

    return maiorDivida;
  } catch (error) {
    console.error("Erro ao buscar maior dívida:", error);
    throw new Error("Erro ao buscar maior dívida");
  }
}

export async function getFaturamentoStats(): Promise<FaturamentoStats> {
  try {
    // Soma de todas as dívidas não pagas (valor a receber)
    const resultadoDividasNaoPagas = await prisma.divida.aggregate({
      where: {
        pago: false
      },
      _sum: {
        valor: true
      }
    });

    // Soma de todas as dívidas pagas (total pago)
    const resultadoDividasPagas = await prisma.divida.aggregate({
      where: {
        pago: true
      },
      _sum: {
        valor: true
      }
    });

    return {
      valor_a_receber: resultadoDividasNaoPagas._sum.valor || 0,
      total_pago: resultadoDividasPagas._sum.valor || 0
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas de faturamento:", error);
    throw new Error("Erro ao buscar estatísticas de faturamento");
  }
}