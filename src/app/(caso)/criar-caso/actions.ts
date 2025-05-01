'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function criarCaso(formData: FormData, userId: string | number) {
  try {
    const processo = formData.get('Processo') as string;
    const resumo = formData.get('Resumo') as string;
    const descricao = formData.get('Descrição Detalhada') as string;
    const clienteId = formData.get('clienteId') as string;

    if (!processo || !resumo || !clienteId || !userId) {
      throw new Error('Processo, Resumo, Cliente e Utilizador são obrigatórios');
    }

    // Converter userId para número
    const userIdNumber = typeof userId === 'string' ? parseInt(userId) : userId;

    await prisma.caso.create({
      data: {
        processo,
        resumo,
        descricao: descricao || null,
        cliente_id: parseInt(clienteId),
        user_id: userIdNumber // Agora garantido ser um número
      }
    });

  } catch (error) {
    console.error('Erro ao criar caso:', error);
    return { error: error instanceof Error ? error.message : 'Ocorreu um erro' };
  }

  revalidatePath('/casos');
  redirect('/casos');
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
    // Verifica se o email já existe
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