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
  try {
    const input = validarInputRegistro(formData, userId, casoId);

    // Transação para criar registro e atualizar caso
    await prisma.$transaction([
      prisma.registro.create({
        data: {
          resumo: input.resumo,
          descricao: input.descricao,
          tipo: input.tipo,
          user_id: input.userId,
          caso_id: input.casoId
        }
      }),
      prisma.caso.update({
        where: { id: input.casoId },
        data: { 
          // Atualiza a data de modificação se necessário
          criado_em: new Date() 
        }
      })
    ]);

    revalidatePath(`/casos/${input.casoId}`);
    redirect(`/casos/${input.casoId}`);

  } catch (error) {
    console.error('Erro ao criar registro:', error);
    throw new Error(error instanceof Error ? error.message : 'Erro desconhecido ao criar registro');
  }
}

// Listar todos os registros de um caso
export async function listarRegistros(casoId: string | number): Promise<RegistroCompleto[]> {
  try {
    const casoIdNumber = typeof casoId === 'string' ? parseInt(casoId) : casoId;
    
    const registros = await prisma.registro.findMany({
      where: { caso_id: casoIdNumber },
      include: { 
        user: { select: { nome: true } },
        caso: { select: { processo: true } } // Inclui informações do caso se necessário
      },
      orderBy: { criado_em: 'desc' }
    });

    return registros.map(reg => ({
      id: reg.id,
      resumo: reg.resumo,
      descricao: reg.descricao,
      tipo: reg.tipo,
      criado_em: reg.criado_em,
      user: { nome: reg.user.nome }
    }));

  } catch (error) {
    console.error('Erro ao listar registros:', error);
    throw new Error('Falha ao carregar registros');
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