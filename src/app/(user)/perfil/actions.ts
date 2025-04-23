'use server';

import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { revalidatePath } from "next/cache";
import { enviarEmailContactoAdmin } from '@/lib/sendEmail'; // importa aqui



interface UserProfile {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  codigo_postal: string;
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

export async function updatePassword(formData: FormData) {
  try {
    const userId = 1; // Substitua por como você obtém o ID (ex: via props, contexto, etc.)
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validações
    if (!newPassword || !confirmPassword) {
      throw new Error("Preencha todos os campos");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("As senhas não coincidem");
    }

    if (newPassword.length < 8) {
      throw new Error("A senha deve ter pelo menos 8 caracteres");
    }

    // Atualiza no banco
    const hashedPassword = await hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    throw error;
  }
}

export async function contactAdmin(formData: FormData) {
  try {
    const message = formData.get('message') as string;
    
    if (!message) {
      throw new Error('A mensagem é obrigatória');
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'joao.silva@email.com';

    // Envie o email usando a função existente ou crie uma nova
    await enviarEmailContactoAdmin({
      userEmail: 'user@exemplo.com', // Substitua pelo email do usuário atual
      message,
      adminEmail
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao contactar admin:', error);
    throw error;
  }
}