// src/app/(caso)/criar-caso/actions.ts
'use server';

import  prisma  from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function criarCaso(formData: FormData, userId: string) {
  try {
    const processo = formData.get("Processo") as string;
    const resumo = formData.get("Resumo") as string;
    const descricao = formData.get("Descrição Detalhada") as string;
    const clientesIds = formData.getAll("clientesIds") as string[];

    if (!processo || !resumo || !userId || clientesIds.length === 0) {
      throw new Error("Campos obrigatórios faltando");
    }

    // Criar o caso com múltiplos clientes
    const novoCaso = await prisma.caso.create({
      data: {
        processo,
        resumo,
        descricao: descricao || null,
        user: {
          connect: { id: parseInt(userId) }
        },
        estado: {
          connect: { id: 1 } // Estado padrão
        },
        clientes: {
          create: clientesIds.map(clienteId => ({
            cliente: {
              connect: { id: parseInt(clienteId) }
            }
          }))
        }
      },
      include: {
        clientes: {
          include: {
            cliente: true
          }
        }
      }
    });

    revalidatePath("/casos");
    return novoCaso;
  } catch (error) {
    console.error("Erro ao criar caso:", error);
    throw error;
  }
}
export async function listarClientes() {
  try {
    const clientes = await prisma.cliente.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        codigoPostal: true,
        endereco: true
      },
      orderBy: {
        nome: 'asc'
      }
    });
    return clientes;
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return [];
  }
}

export async function criarCliente(clienteData: {
  nome: string;
  email: string;
  telefone: string;
  codigoPostal: string;
  endereco: string;
}) {
  try {
    const clienteExistente = await prisma.cliente.findUnique({
      where: {
        email: clienteData.email
      }
    });

    if (clienteExistente) {
      throw new Error('Já existe um cliente com este email');
    }

    const novoCliente = await prisma.cliente.create({
      data: {
        nome: clienteData.nome,
        email: clienteData.email,
        telefone: clienteData.telefone,
        codigoPostal: clienteData.codigoPostal,
        endereco: clienteData.endereco
      }
    });

    return novoCliente;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error instanceof Error ? error : new Error('Ocorreu um erro ao criar o cliente');
  }
}
