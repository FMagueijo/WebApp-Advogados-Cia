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

export async function fetchCasoProfile(casoId: number): Promise<CasoProfile | null> {
  try {
    const caso = await prisma.caso.findUnique({
      where: { id: casoId },
      select: {
        id: true,
        processo: true,
        estado: {
          select: {
            nome_estado: true
          }
        },
        resumo: true,
        descricao: true,
      }
    });

    if (!caso) {
      throw new Error('Caso não encontrado');
    }

    return {
      id: caso.id,
      processo: caso.processo,
      estado: caso.estado.nome_estado,
      resumo: caso.resumo,
      descricao: caso.descricao as string,
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
    // First get the case with user and collaborators
    const caso = await prisma.caso.findUnique({
      where: { id: casoId },
      select: {
        user: {
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
        },
        colaboradores: {
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
        }
      }
    });

    if (!caso) return [];

    // Then get all worked hours for this case in a separate query
    const horasTrabalhadas = await prisma.horasTrabalhadas.findMany({
      where: { caso_id: casoId },
      select: {
        horas: true,
        user_id: true
      }
    });

    // Create a map of user_id to total hours
    const horasPorColaborador = horasTrabalhadas.reduce((acc, ht) => {
      acc[ht.user_id] = (acc[ht.user_id] || 0) + ht.horas;
      return acc;
    }, {} as Record<number, number>);

    // Combine the main user and collaborators, removing duplicates
    const todosColaboradores = [caso.user, ...caso.colaboradores];

    // Remove duplicates and add hours information
    const uniqueColaboradores = todosColaboradores
      .filter((colab, index, self) =>
        index === self.findIndex((t) => t.id === colab.id)
      )
      .map(colab => ({
        ...colab,
        totalHoras: horasPorColaborador[colab.id] || 0,
        HorasTrabalhadas: horasTrabalhadas
          .filter(ht => ht.user_id === colab.id)
          .map(ht => ({ horas: ht.horas }))
      }));

    return uniqueColaboradores;
  } catch (error) {
    console.error("Erro ao buscar colaboradores do caso:", error);
    throw error;
  }
}
export async function fetchClientesDoCaso(casoId: number) {
  try {
    const caso = await prisma.caso.findUnique({
      where: { id: casoId },
      include: {
        clientes: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            dividas: {
              select: {
                valor: true,
              },
              where: {
                pago: false,
                caso_id: casoId
              },
            }
          }
        }
      }
    });

    if (!caso) return [];

    // Transform each client to include calculated total debt
    return caso.clientes.map(cliente => ({
      ...cliente,
      totalDivida: cliente.dividas.reduce((total, divida) => total + divida.valor, 0)
    }));

  } catch (error) {
    console.error("Erro ao buscar clientes do caso:", error);
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
        role_id: 2 // Filtra apenas usuários com role_id = 2 (colaboradores)
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

export async function registrarHonorario(casoId: number, valor: number, assunto: string, clienteId: number) {
  try {
    // Cria uma nova dívida com os dados fornecidos
    const novaDivida = await prisma.divida.create({
      data: {
        valor: valor,
        assunto: assunto,
        pago: false,
        caso: {
          connect: { id: casoId }
        },
        cliente: {
          connect: { id: clienteId }
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

export async function listarClientes() {
  try {
    const clientes = await prisma.cliente.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true
      }
    });
    return clientes;
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    throw error;
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
        assunto: true,
        criado_em: true,
        pago: true,
        cliente: {
          select: {
            id: true,
            nome: true
          }
        }
      },
      orderBy: [
        {
          pago: 'asc' // This will put unpaid debts (false) first, then paid (true)
        },
        {
          criado_em: 'desc' // Then sort by creation date, newest first
        }
      ],
    });
    return dividas;
  } catch (error) {
    console.error("Erro ao buscar dívidas do caso:", error);
    throw error;
  }
}

export async function adicionarColaboradorAoCaso(casoId: number, colaboradorId: number): Promise<boolean> {
  try {
    await prisma.caso.update({
      where: { id: casoId },
      data: {
        colaboradores: {
          connect: { id: colaboradorId }
        }
      }
    });

    revalidatePath(`/caso/${casoId}`);
    return true;
  } catch (error) {
    console.error('Erro ao adicionar colaborador:', error);
    return false;
  }
}

export async function removerColaboradorDoCaso(casoId: number, colaboradorId: number): Promise<boolean> {
  try {
    await prisma.caso.update({
      where: { id: casoId },
      data: {
        colaboradores: {
          disconnect: { id: colaboradorId }
        }
      }
    });

    revalidatePath(`/caso/${casoId}`);
    return true;
  } catch (error) {
    console.error('Erro ao remover colaborador:', error);
    return false;
  }
}

export async function adicionarClienteAoCaso(casoId: number, clienteId: number): Promise<boolean> {
  try {
    await prisma.caso.update({
      where: { id: casoId },
      data: {
        clientes: {
          connect: { id: clienteId }
        }
      }
    });

    revalidatePath(`/caso/${casoId}`);
    return true;
  } catch (error) {
    console.error('Erro ao adicionar cliente:', error);
    return false;
  }
}

export async function removerClienteDoCaso(casoId: number, clienteId: number): Promise<boolean> {
  try {
    await prisma.caso.update({
      where: { id: casoId },
      data: {
        clientes: {
          disconnect: { id: clienteId }
        }
      }
    });

    revalidatePath(`/caso/${casoId}`);
    return true;
  } catch (error) {
    console.error('Erro ao remover cliente:', error);
    return false;
  }
}