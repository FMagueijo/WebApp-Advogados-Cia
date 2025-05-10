'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface CasoProfile {
  id?: number;
  processo: string;
  resumo: string;
  estado: string;
  descricao?: string;
}

export async function fetchCasoProfile(casoId: number): Promise<CasoProfile | null>  {
  try {
    const user = await prisma.caso.findUnique({
      where: { id: casoId },
      select: {
        id: true,
        processo: true,
        estado: true,
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
        estado: user.estado.nome_estado,
        resumo: user.resumo,
        descricao: user.descricao as string,
    };
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function updateCasoEstado(casoId: number, novoEstado: string): Promise<boolean> {
  try {
    await prisma.caso.update({
      where: { id: casoId },
      data: {
        estado: {
          connect: { nome_estado: novoEstado },
        },
      },
    });

    revalidatePath(`/caso/${casoId}`);
    return true;
  } catch (error) {
    console.error('Error updating caso estado:', error);
    return false;
  }
}
export async function fetchColaboradoresDoCaso(casoId: number): Promise<{id: number, nome: string}[]> {
  try {
    // Busca os colaboradores através dos registros
    const colaboradoresViaRegistros = await prisma.registro.findMany({
      where: { caso_id: casoId },
      distinct: ['user_id'],
      select: {
        user: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    // Busca o criador do caso
    const caso = await prisma.caso.findUnique({
      where: { id: casoId },
      select: {
        user: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    if (!caso) {
      throw new Error('Caso não encontrado');
    }

    // Combina os colaboradores e remove duplicados
    const colaboradores = [
      ...colaboradoresViaRegistros.map(r => r.user),
      caso.user,
    ];

    // Remove duplicados baseado no ID do usuário
    const uniqueColaboradores = colaboradores.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [] as {id: number, nome: string}[]);

    return uniqueColaboradores;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}
export async function updateCasoResumo(casoId: number, novoResumo: string): Promise<boolean> {
  try {
    await prisma.caso.update({
      where: { id: casoId },
      data: { resumo: novoResumo },
    });

    revalidatePath(`/caso/${casoId}`);
    return true;
  } catch (error) {
    console.error('Error updating resumo:', error);
    return false;
  }
}

export async function updateCasoDescricao(casoId: number, novaDescricao: string): Promise<boolean> {
  try {
    await prisma.caso.update({
      where: { id: casoId },
      data: { descricao: novaDescricao },
    });

    revalidatePath(`/caso/${casoId}`);
    return true;
  } catch (error) {
    console.error('Error updating descricao:', error);
    return false;
  }
}