// app/(colab)/colaboradores/criar/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { enviarEmailNovoColaborador } from '@/lib/sendEmail'; // importa aqui

export async function criarColaborador(formData: FormData) {
  try {
    const nome = formData.get('Nome completo') as string;
    const email = formData.get('Email') as string;
    const telefone = formData.get('Telefone') as string;
    const codigoPostal = formData.get('Código Postal') as string;
    const endereco = formData.get('Endereço') as string;

    if (!nome || !email || !telefone || !codigoPostal || !endereco) {
      throw new Error('Todos os campos são obrigatórios');
    }

    // Verificar se o email já existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      throw new Error('Já existe um colaborador com este email');
    }

    const novoColaborador = await prisma.user.create({
      data: {
        nome,
        email,
        telefone,
        codigo_postal: codigoPostal,
        endereco,
        role: {
          connect: {
            nome_role: 'colaborador'
          }
        }
      }
    });


    const token = await prisma.tokenPass.create({
      data: {
        user_id: novoColaborador.id
      }
    });
    const link = 'http://localhost:3000/definir-password/' + token.token;
    await enviarEmailNovoColaborador(nome, email, link);
    

  } catch (error) {
    console.error('Erro ao criar colaborador:', error);
    throw error;
  }

  revalidatePath('/colaboradores');
  redirect('/colaboradores');

}