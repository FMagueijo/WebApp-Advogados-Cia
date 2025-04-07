// app/(colab)/colaboradores/criar/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function criarColaborador(formData: FormData) {
  try {
    // Extrair dados do formulário
    const nome = formData.get('Nome completo') as string;
    const email = formData.get('Email') as string;
    const telefone = formData.get('Telefone') as string;
    const codigoPostal = formData.get('Código Postal') as string;
    const endereco = formData.get('Endereço') as string;

    // Validar dados (podes adicionar mais validações conforme necessário)
    if (!nome || !email || !telefone || !codigoPostal || !endereco) {
      throw new Error('Todos os campos são obrigatórios');
    }

    // Criar o colaborador na base de dados
    const novoColaborador = await prisma.user.create({
      data: {
        nome,
        email,
        telefone, 
        codigo_postal: codigoPostal,
        endereco,
        esta_verificado: false,
        role: {
          connect: {
            nome_role: 'colaborador'
          }
        }
      }
    });

    // Atualizar a cache e redirecionar
    revalidatePath('/colaboradores');
    redirect('/colaboradores');
    
  } catch (error) {
    console.error('Erro ao criar colaborador:', error);
    throw error; // Podes tratar este erro na tua UI
  }
}