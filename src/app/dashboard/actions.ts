// src/actions/dashboard.ts
import prisma from "@/lib/prisma"; 

import { getServerSession } from "next-auth";

export async function getDashboardData() {
  const session = await getServerSession();

  const [casosAbertos, casosFechados, casosTerminados, totalCasos] = await Promise.all([
    prisma.caso.count({ where: { estado: { nome_estado: "Em Aberto" } } }),
    prisma.caso.count({ where: { estado: { nome_estado: "Fechado" } } }),
    prisma.caso.count({ where: { estado: { nome_estado: "Terminado" } } }),
    prisma.caso.count(),
  ]);

  const [totalColaboradores, totalClientes] = await Promise.all([
    prisma.user.count(),
    prisma.cliente.count(),
  ]);

  const faturamento = await prisma.divida.aggregate({
    _sum: { valor: true },
    where: { pago: true },
  });

  const aReceber = await prisma.divida.aggregate({
    _sum: { valor: true },
    where: { pago: false },
  });

  const maiorDivida = await prisma.divida.findFirst({
    orderBy: { valor: "desc" },
    include: { cliente: true },
  });

  const topColaborador = await prisma.user.findFirst({
    where: {
      casos: { some: {} },
    },
    orderBy: {
      casos: {
        _count: "desc",
      },
    },
    include: {
      casos: true,
    },
  });

  const topCliente = await prisma.cliente.findFirst({
    where: {
      casos: { some: {} },
    },
    orderBy: {
      casos: {
        _count: "desc",
      },
    },
    include: {
      casos: true,
    },
  });

  return {
    session,
    casos: {
      abertos: casosAbertos,
      fechados: casosFechados,
      terminados: casosTerminados,
      total: totalCasos,
    },
    colaboradores: totalColaboradores,
    clientes: totalClientes,
    faturamento: {
      total: faturamento._sum.valor || 0,
      aReceber: aReceber._sum.valor || 0,
    },
    maiorDivida,
    topColaborador,
    topCliente,
  };
}
