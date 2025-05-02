'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface CasoProfile {
  id?: number;
  processo: string;
  resumo: string;
  descricao?: string;
}

export async function fetchCasoProfile(casoId: number): Promise<CasoProfile | null>  {
  try {
    const user = await prisma.caso.findUnique({
      where: { id: casoId },
      select: {
        id: true,
        processo: true,
        resumo: true, 
        descricao: true,
      }
    });

    if (!user) {
      throw new Error('Caso não encontrado');
    }

    return {
        id: user.id,
        processo: user.processo,
        resumo: user.resumo,
        descricao: user.descricao as string,
    };
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}