'use server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface CasoFilters {
  estado?: string;
  [key: string]: any;
}

interface OrderOptions {
  [key: string]: boolean;
}

interface TransformedCaso {
  id: number;
  processo: string;
  assunto: string;
  criadoPor: string;
  criadoPorId: number;
  cliente: string;
  estado: string;
  dataCriacao: Date;
  todosClientes: {
    id: number;
    nome: string;
  }[];
}

export async function fetchCasos(
  filters: CasoFilters = {},
  order: OrderOptions = {}
): Promise<TransformedCaso[]> {
  try {
    const where: Prisma.CasoWhereInput = {};

    console.log("Fetching casos with filters:", filters);
    if (filters.ID) where.id = Number(filters.ID);
    if (filters.Processo) where.processo = { contains: filters.Processo };
    if (filters.Resumo) where.resumo = { contains: filters.Resumo };
    if (filters.Estado) where.estado = { nome_estado: filters.Estado };

    console.log("Where clause:", where);
    const orderBy: Prisma.CasoOrderByWithRelationInput[] = [];
    for (const [key, value] of Object.entries(order)) {
      const prismaKey = {
        "ID": "id",
        "Processo": "processo",
        "Assunto": "resumo"
      }[key] || key;
      orderBy.push({ [prismaKey]: value ? "desc" : "asc" });
    }

    // Get casos with all needed relations
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
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    // Transform results
    return casos.map(caso => ({
      id: caso.id,
      processo: caso.processo,
      assunto: caso.resumo,
      criadoPor: caso.user?.nome || 'Desconhecido',
      criadoPorId: caso.user?.id || 0,
      cliente: caso.clientes[0]?.nome || 'Desconhecido',
      estado: caso.estado?.nome_estado || 'Desconhecido',
      dataCriacao: caso.criado_em,
      todosClientes: caso.clientes.map(c => ({
        id: c.id,
        nome: c.nome
      }))
    }));
  } catch (error) {
    console.error("Erro ao buscar casos:", error);
    throw new Error("Falha ao buscar casos");
  }
}