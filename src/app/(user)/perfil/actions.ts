'use server';

import prisma from '@/lib/prisma';
import { enviarEmailNovoColaborador } from '@/lib/sendEmail';
import { revalidatePath } from 'next/cache';
import { hash } from 'bcryptjs';
import { enviarEmailContactoAdmin } from '@/lib/sendEmail'; // importa aqui



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

export async function updatePassword(formData: FormData) {
  try {
    // Get user ID from session (you'll need to pass it from the client)
    const userId = formData.get('userId') as string;
    if (!userId) throw new Error("User not authenticated");

    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validations
    if (!newPassword || !confirmPassword) {
      throw new Error("Preencha todos os campos");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("As senhas não coincidem");
    }

    if (newPassword.length < 8) {
      throw new Error("A senha deve ter pelo menos 8 caracteres");
    }

    // Hash and update password
    const hashedPassword = await hash(newPassword, 12);
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { password_hash: hashedPassword },
    });

    revalidatePath('/perfil');
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    throw error;
  }
}

export async function contactAdmin(formData: FormData, userId: number) {
  try {
    const message = formData.get('message') as string;
    const userEmail = formData.get('userEmail') as string;
    const title = formData.get('title') as string;

    if (!message) throw new Error('A mensagem é obrigatória');
    if (!userEmail) throw new Error('Email do usuário não encontrado');

    // Fetch all users who are admins
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nome: true, email: true }
    });
    if (!user) throw new Error('Usuário não encontrado');

    const adminUsers = await prisma.user.findMany({
      where: { role: { nome_role: 'admin' } },
      select: { email: true }
    });

    if (!adminUsers || adminUsers.length === 0) {
      throw new Error('Nenhum administrador encontrado');
    }

    // Send email to all admins
    for (const admin of adminUsers) {
      await enviarEmailContactoAdmin({
        user: user.nome,
        message,
        adminEmail: admin.email,
        title: title
      });
    }

    await enviarEmailContactoAdmin({
      user: user.nome,
      message,
      adminEmail: "advogadoscia840@gmail.com",
      title: title
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao contactar admin:', error);
    throw error;
  }
}