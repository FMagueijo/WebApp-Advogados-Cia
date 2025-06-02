// src/app/(caso)/criar-caso/actions.ts
'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface ClienteData {
  nome: string;
  email: string;
  telefone: string;
  codigoPostal: string;
  endereco: string;
}

export async function criarCaso(formData: FormData, userId: string) {
  try {
    const processo = formData.get("Processo") as string;
    const resumo = formData.get("Resumo") as string;
    const descricao = formData.get("Descrição Detalhada") as string | null;
    const clientesIds = formData.getAll("clientesIds") as string[];

    if (!processo || !resumo || !userId || clientesIds.length === 0) {
      throw new Error("Campos obrigatórios faltando");
    }

    // Convert userId to number
    const userIdNumber = parseInt(userId);
    if (isNaN(userIdNumber)) {
      throw new Error("ID de usuário inválido");
    }

    // Convert clientesIds to numbers
    const clientesIdsNumbers = clientesIds.map(id => {
      const num = parseInt(id);
      if (isNaN(num)) throw new Error("ID de cliente inválido");
      return num;
    });

    // Create the case with multiple clients
    const novoCaso = await prisma.caso.create({
      data: {
        processo,
        resumo,
        descricao: descricao || null,
        user_id: userIdNumber,
        estado_id: 1,
        clientes: {
          connect: clientesIdsNumbers.map(id => ({ id }))
        }
      },
      include: {
        clientes: true, // This will include the clientes relation
        estado: true,   // Include estado if needed
        user: true     // Include user if needed
      }
    });

    revalidatePath("/casos");
    redirect("/casos");
    
    return novoCaso;
  } catch (error) {
    console.error("Erro ao criar caso:", error);
    throw error instanceof Error ? error : new Error("Ocorreu um erro ao criar o caso");
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
    throw error instanceof Error ? error : new Error("Ocorreu um erro ao listar clientes");
  }
}

export async function criarCliente(clienteData: ClienteData) {
  try {
    // Validate required fields


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
        codigoPostal: clienteData.codigoPostal || '',
        endereco: clienteData.endereco || ''
      }
    });

    return novoCliente;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error instanceof Error ? error : new Error('Ocorreu um erro ao criar o cliente');
  }
}