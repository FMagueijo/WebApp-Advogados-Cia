'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface RegistroProfile {
  id?: number;
  tipo: string;
  resumo: string;
  descricao: string;
}

interface UpdateRegistroData {
  resumo: string;
  descricao: string;
}

export async function fetchRegistroProfile(registroId: number): Promise<RegistroProfile> {
  try {
    const registro = await prisma.registro.findUnique({
      where: { idRegisto: registroId },
      select: {
        idRegisto: true,
        tipo: true,
        resumo: true,
        descricao: true,
      },
    });

    if (!registro) throw new Error('Registro não encontrado');

    return {
      id: registro.idRegisto,
      tipo: registro.tipo,
      resumo: registro.resumo,
      descricao: registro.descricao || '',
    };
  } catch (error) {
    console.error('Erro ao carregar registro:', error);
    throw new Error('Erro ao carregar dados do registro');
  }
}

export async function updateRegistroProfile(registroId: number, data: UpdateRegistroData) {
  try {
    const updated = await prisma.registro.update({
      where: { idRegisto: registroId },
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