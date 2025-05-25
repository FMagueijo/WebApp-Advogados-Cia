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

export async function fetchColaboradoresDoCaso(casoId: number) {
  try {
    const caso = await prisma.caso.findUnique({
      where: { id: casoId },
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });
    
    return caso ? [caso.user] : [];
  } catch (error) {
    console.error("Erro ao buscar colaboradores do caso:", error);
    throw error;
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

export async function listarColaboradores() {
  try {
    const colaboradores = await prisma.user.findMany({
      where: {
        role_id: 2 // Filtra apenas usuários com role_id = 2
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: {
          select: {
            nome_role: true
          }
        }
      }
    });
    return colaboradores;
  } catch (error) {
    console.error("Erro ao listar colaboradores:", error);
    throw error;
  }
}

export async function registrarHonorario(casoId: number, valor: number) {
  try {
    // Verifica se já existe uma dívida não paga para este caso
    const dividaExistente = await prisma.divida.findFirst({
      where: {
        caso_id: casoId,
        pago: false
      }
    });

    if (dividaExistente) {
      // Atualiza a dívida existente somando o novo valor
      const updatedDivida = await prisma.divida.update({
        where: { id: dividaExistente.id },
        data: { 
          valor: dividaExistente.valor + valor 
        }
      });
      revalidatePath(`/caso/${casoId}`);
      return { success: true, message: 'Valor adicionado à dívida existente' };
    } else {
      // Cria uma nova dívida
      const novaDivida = await prisma.divida.create({
        data: {
          valor: valor,
          pago: false,
          caso: {
            connect: { id: casoId }
          },
          cliente: {
            connect: { id: 1 } // Substitua pelo ID do cliente real ou obtenha dinamicamente
          }
        }
      });
      revalidatePath(`/caso/${casoId}`);
      return { success: true, message: 'Nova dívida criada' };
    }
  } catch (error) {
    console.error('Erro ao registrar honorário:', error);
    return { success: false, message: 'Erro ao registrar honorário' };
  }
}

export async function pagarHonorario(casoId: number, valorPagamento: number) {
  try {
    // Encontra a dívida não paga para este caso
    const divida = await prisma.divida.findFirst({
      where: {
        caso_id: casoId,
        pago: false
      }
    });

    if (!divida) {
      return { 
        success: false, 
        message: 'Não há dívidas pendentes para este caso' 
      };
    }

    if (valorPagamento > divida.valor) {
      return { 
        success: false, 
        message: 'Valor de pagamento excede o valor da dívida' 
      };
    }

    if (valorPagamento === divida.valor) {
      // Pagamento total - marca como pago
      await prisma.divida.update({
        where: { id: divida.id },
        data: { pago: true }
      });
      revalidatePath(`/caso/${casoId}`);
      return { success: true, message: 'Dívida paga integralmente' };
    } else {
      // Pagamento parcial - atualiza o valor da dívida
      await prisma.divida.update({
        where: { id: divida.id },
        data: { valor: divida.valor - valorPagamento }
      });
      revalidatePath(`/caso/${casoId}`);
      return { success: true, message: 'Pagamento parcial realizado' };
    }
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return { success: false, message: 'Erro ao processar pagamento' };
  }
}

export async function fetchRegistrosDoCaso(casoId: number, order: 'asc' | 'desc' = 'desc') {
  try {
    const registros = await prisma.registro.findMany({
      where: { caso_id: casoId },
      select: {
        id: true,
        resumo: true,
        criado_em: true,
        tipo: true
      },
      orderBy: {
        criado_em: order
      }
    });
    return registros;
  } catch (error) {
    console.error("Erro ao buscar registros do caso:", error);
    throw error;
  }
}

export async function fetchDividasDoCaso(casoId: number) {
  try {
    const dividas = await prisma.divida.findMany({
      where: { caso_id: casoId },
      select: {
        id: true,
        valor: true,
        criado_em: true,
        pago: true,
        cliente: {
          select: {
            id: true,
            nome: true
          }
        }
      },
      orderBy: {
        criado_em: 'desc'
      }
    });
    return dividas;
  } catch (error) {
    console.error("Erro ao buscar dívidas do caso:", error);
    throw error;
  }
}