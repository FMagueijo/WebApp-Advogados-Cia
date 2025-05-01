'use server';

import prisma from '@/lib/prisma';
import { enviarEmailNovoColaborador } from '@/lib/sendEmail';
import { revalidatePath } from 'next/cache';

interface UserProfile {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  codigo_postal: string;
}

export async function requestNewPassword(userId: number){
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, nome: true }
    });

    if (!user || !user.email) {
      throw new Error('Usuário não encontrado ou sem email');
    }
    const token = await prisma.tokenPass.create({
      data: {
        user_id: userId
      }
    });
    const link = 'http://localhost:3000/definir-password/' + token.token;
    await enviarEmailNovoColaborador(user.nome, user.email, link);
  } catch (error) {
    console.error('Error creating token or sending email:', error);
    throw new Error('Erro ao solicitar nova senha');
  }
      
}
export async function fetchUserProfile(userId: number): Promise<UserProfile> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        endereco: true,
        codigo_postal: true
      }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return {
      nome: user.nome,
      email: user.email,
      telefone: user.telefone ?? '',
      endereco: user.endereco ?? '',
      codigo_postal: user.codigo_postal ?? ''
    };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Erro ao carregar perfil: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

export async function updateUserProfile(userId: number, data: Omit<UserProfile, 'email'>) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nome: data.nome,
        telefone: data.telefone || null,
        endereco: data.endereco || null,
        codigo_postal: data.codigo_postal || null
      },
      select: {
        nome: true,
        telefone: true,
        endereco: true,
        codigo_postal: true
      }
    });

    revalidatePath('/perfil');
    return {
      nome: updatedUser.nome,
      telefone: updatedUser.telefone ?? '',
      endereco: updatedUser.endereco ?? '',
      codigo_postal: updatedUser.codigo_postal ?? ''
    };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error(`Erro ao atualizar perfil: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}