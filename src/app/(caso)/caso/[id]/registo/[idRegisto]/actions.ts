'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface Documento {
  id: number;
  nome: string;
  caminho: string;
  tipo: string;
  tamanho: number;
  public_id: string;
}

interface RegistroProfile {
  id?: number;
  tipo: string;
  resumo: string;
  descricao: string;
  documentos: Documento[];
}

interface UpdateRegistroData {
  resumo: string;
  descricao: string;
}

export async function fetchRegistroProfile(registroId: number): Promise<RegistroProfile> {
  try {
    const registro = await prisma.registro.findUnique({
      where: { id: registroId },
      select: {
        id: true,
        tipo: true,
        resumo: true,
        descricao: true,
        documentos: {
          select: {
            id: true,
            nome: true,
            caminho: true,
            tipo: true,
            tamanho: true,
            public_id: true,
          },
        },
      },
    });

    if (!registro) throw new Error('Registro não encontrado');

    return {
      id: registro.id,
      tipo: registro.tipo,
      resumo: registro.resumo,
      descricao: registro.descricao || '',
      documentos: registro.documentos,
    };
  } catch (error) {
    console.error('Erro ao carregar registro:', error);
    throw new Error('Erro ao carregar dados do registro');
  }
}

export async function updateRegistroProfile(registroId: number, data: UpdateRegistroData) {
  try {
    const updated = await prisma.registro.update({
      where: { id: registroId },
      data: {
        resumo: data.resumo,
        descricao: data.descricao,
      },
    });

    revalidatePath(`/caso/[idcaso]/registo/[idRegisto]`);
    return {
      resumo: updated.resumo,
      descricao: updated.descricao || '',
    };
  } catch (error) {
    console.error('Erro ao atualizar registro:', error);
    throw new Error('Erro ao atualizar dados do registro');
  }
}