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
    const caso = await prisma.caso.findUnique({
      where: { id: casoId },
      include: {
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
          include: {
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
            }
          }
        }
      }
    });
    
    if (!caso) return [];
    
    const colaboradoresAdicionais = caso.colaboradores.map(c => c.user);
    const todosColaboradores = [caso.user, ...colaboradoresAdicionais];
    
    return todosColaboradores.filter((colab, index, self) =>
      index === self.findIndex((t) => t.id === colab.id)
    );
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
          include: {
            cliente: {
              select: {
                id: true,
                nome: true,
                email: true,
                telefone: true
              }
            }
          }
        }
      }
    });
    
    if (!caso) return [];
    
    return caso.clientes.map(c => c.cliente);
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

export async function adicionarColaboradorAoCaso(casoId: number, colaboradorId: number): Promise<boolean> {
  try {
    await prisma.colaboradorDoCaso.create({
      data: {
        user_id: colaboradorId,
        caso_id: casoId
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
    await prisma.colaboradorDoCaso.delete({
      where: {
        user_id_caso_id: {
          user_id: colaboradorId,
          caso_id: casoId
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
    await prisma.clienteDoCaso.create({
      data: {
        cliente_id: clienteId,
        caso_id: casoId
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
    await prisma.clienteDoCaso.delete({
      where: {
        cliente_id_caso_id: {
          cliente_id: clienteId,
          caso_id: casoId
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