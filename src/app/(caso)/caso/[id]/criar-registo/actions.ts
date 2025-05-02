'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Tipos para Registros
interface RegistroInput {
  resumo: string;
  descricao?: string | null; // Corrigido para aceitar explicitamente null
  tipo: string;
  casoId: number;
  userId: number;
}

interface RegistroCompleto {
  id: number;
  resumo: string;
  descricao: string | null;
  tipo: string;
  criado_em: Date;
  user: {
    nome: string;
  };
}

// Criar um novo registro
export async function criarRegistro(formData: FormData, userId: string | number, casoId: string | number): Promise<void> {
  const input = validarInputRegistro(formData, userId, casoId);
  try {
    // Transação para criar registro e atualizar caso
    await prisma.registro.create({
      data: {
        resumo: input.resumo,
        descricao: input.descricao,
        tipo: input.tipo,
        user_id: input.userId,
        caso_id: input.casoId
      }
    })

    revalidatePath(`/caso/${input.casoId}`);
    redirect(`/caso/${input.casoId}`);

  } catch (error) {
    console.error('Erro ao criar registro:', error);
  }
}

// Função auxiliar para validação
function validarInputRegistro(formData: FormData, userId: string | number, casoId: string | number): RegistroInput {
  const resumo = formData.get('resumo') as string;
  const descricao = formData.get('descricao') as string | null; // Explicitamente string | null
  const tipo = formData.get('tipo') as string;
  const userIdNumber = typeof userId === 'string' ? parseInt(userId) : userId;
  const casoIdNumber = typeof casoId === 'string' ? parseInt(casoId) : casoId;

  if (!resumo?.trim() || !tipo?.trim()) {
    throw new Error('Resumo e tipo são obrigatórios');
  }

  if (isNaN(userIdNumber)) {
    throw new Error('ID de usuário inválido');
  }

  if (isNaN(casoIdNumber)) {
    throw new Error('ID de caso inválido');
  }

  return {
    resumo,
    descricao: descricao || null, // Agora compatível com a interface
    tipo,
    casoId: casoIdNumber,
    userId: userIdNumber
  };
}