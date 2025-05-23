// app/dashboard/actions.ts
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getDashboardData() {
  const session = await getServerSession(authOptions);

  // Obter contagem de casos por estado
  const casos = await prisma.caso.groupBy({
    by: ['estado_id'],
    _count: {
      _all: true
    }
  });

  // Obter nomes dos estados para mapeamento
  const estados = await prisma.casoEstado.findMany();
  const estadoMap = estados.reduce((acc, estado) => {
    acc[estado.id] = estado.nome_estado;
    return acc;
  }, {} as Record<number, string>);

  // Processar contagem de casos
  const casosCount = {
    abertos: casos.find(c => estadoMap[c.estado_id] === 'ABERTO')?._count._all || 0,
    fechados: casos.find(c => estadoMap[c.estado_id] === 'FECHADO')?._count._all || 0,
    terminados: casos.find(c => estadoMap[c.estado_id] === 'TERMINADO')?._count._all || 0,
    total: casos.reduce((sum, c) => sum + c._count._all, 0)
  };

  // Obter contagem de colaboradores e clientes
  const [colaboradores, clientes] = await Promise.all([
    prisma.user.count({
      where: { role_id: 2 } // Assumindo que role_id 2 é colaborador
    }),
    prisma.cliente.count()
  ]);

  // Obter dados de faturamento
  const faturamento = await prisma.divida.aggregate({
    _sum: {
      valor: true
    },
    where: {
      pago: true
    }
  });

  const aReceber = await prisma.divida.aggregate({
    _sum: {
      valor: true
    },
    where: {
      pago: false
    }
  });

  // Obter maior dívida
  const maiorDivida = await prisma.divida.findFirst({
    where: {
      pago: false
    },
    orderBy: {
      valor: 'desc'
    },
    include: {
      cliente: true
    }
  });

  // Obter top colaborador (com mais casos)
  const topColaborador = await prisma.user.findFirst({
    orderBy: {
      casos: {
        _count: 'desc'
      }
    },
    include: {
      casos: true
    },
    where: {
      role_id: 2 // Filtra apenas colaboradores
    }
  });

  // Obter top cliente (com mais casos)
  const topCliente = await prisma.cliente.findFirst({
    orderBy: {
      casos: {
        _count: 'desc'
      }
    },
    include: {
      casos: true
    }
  });

  return {
    casos: casosCount,
    colaboradores,
    clientes,
    faturamento: {
      total: faturamento._sum.valor || 0,
      aReceber: aReceber._sum.valor || 0
    },
    maiorDivida: maiorDivida ? {
      valor: maiorDivida.valor,
      cliente: {
        id: maiorDivida.cliente.id,
        nome: maiorDivida.cliente.nome
      }
    } : null,
    topColaborador: topColaborador ? {
      id: topColaborador.id,
      nome: topColaborador.nome,
      casos: topColaborador.casos
    } : null,
    topCliente: topCliente ? {
      id: topCliente.id,
      nome: topCliente.nome,
      casos: topCliente.casos
    } : null,
    session
  };
}