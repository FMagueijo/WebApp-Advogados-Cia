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

export async function registrarHonorario(casoId: number, valor: number, assunto: string) {
  try {
    // Primeiro, buscar o caso para obter o ID do cliente associado
    const caso = await prisma.caso.findUnique({
      where: { id: casoId },
      select: {
        cliente_id: true
      }
    });

    if (!caso) {
      return { success: false, message: 'Caso não encontrado' };
    }

    if (!caso.cliente_id) {
      return { success: false, message: 'Nenhum cliente associado a este caso' };
    }

    // Cria uma nova dívida com os dados fornecidos
    const novaDivida = await prisma.divida.create({
      data: {
        valor: valor,
        assunto: assunto, // Adiciona o campo assunto
        pago: false,
        caso: {
          connect: { id: casoId }
        },
        cliente: {
          connect: { id: caso.cliente_id } // Usa o ID do cliente obtido dinamicamente
        }
      }
    });
    
    revalidatePath(`/caso/${casoId}`);
    return { success: true, message: 'Novo honorário registrado com sucesso' };
  } catch (error) {
    console.error('Erro ao registrar honorário:', error);
    return { success: false, message: 'Erro ao registrar honorário' };
  }
}

export async function pagarDivida(dividaId: number, valorPagamento: number) {
  try {
    const divida = await prisma.divida.findUnique({
      where: { id: dividaId }
    });

    if (!divida) {
      return { 
        success: false, 
        message: 'Dívida não encontrada' 
      };
    }

    if (divida.pago) {
      return { 
        success: false, 
        message: 'Esta dívida já foi paga' 
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
        where: { id: dividaId },
        data: { pago: true }
      });
    } else {
      // Cria uma nova dívida com o valor restante
      await prisma.divida.create({
        data: {
          valor: divida.valor - valorPagamento,
          assunto: divida.assunto,
          pago: false,
          caso: { connect: { id: divida.caso_id } },
          cliente: { connect: { id: divida.cliente_id } }
        }
      });
      
      // Atualiza a dívida original com o valor pago e marca como paga
      await prisma.divida.update({
        where: { id: dividaId },
        data: { 
          pago: true,
          valor: valorPagamento 
        }
      });
    }
    
    return { success: true, message: 'Pagamento realizado com sucesso' };
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return { success: false, message: 'Erro ao processar pagamento' };
  }
}

export async function pagarDividaTotal(dividaId: number) {
  try {
    const divida = await prisma.divida.findUnique({
      where: { id: dividaId }
    });

    if (!divida) {
      return { 
        success: false, 
        message: 'Dívida não encontrada' 
      };
    }

    if (divida.pago) {
      return { 
        success: false, 
        message: 'Esta dívida já foi paga' 
      };
    }

    // Marca a dívida como paga
    await prisma.divida.update({
      where: { id: dividaId },
      data: { pago: true }
    });

    return { success: true, message: 'Dívida paga integralmente' };
  } catch (error) {
    console.error('Erro ao pagar dívida:', error);
    return { success: false, message: 'Erro ao pagar dívida' };
  }
}

export async function fetchRegistrosDoCaso(casoId: number, order: 'asc' | 'desc' = 'desc') {
  try {
    const registros = await prisma.registro.findMany({
      where: { caso_id: casoId },
      select: {
        idRegisto: true,
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
        assunto: true, // Adicione esta linha
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