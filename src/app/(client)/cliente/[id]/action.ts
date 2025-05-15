'use server';

import prisma from '@/lib/prisma';

export async function fetchClientProfile(clientId: number) {
  try {
    const client = await prisma.cliente.findUnique({
      where: { id: clientId },
      include: {
        casos: {
          include: {
            estado: true
          },
          orderBy: {
            criado_em: 'desc'
          }
        }
      }
    });

    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    return client;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Falha ao carregar perfil do cliente');
  }
}
export async function updateClientProfile(clientId: number, data: {
  nome: string;
  telefone: string;
  endereco: string;
  codigoPostal: string;
}) {
  try {
    const updatedClient = await prisma.cliente.update({
      where: { id: clientId },
      data: {
        nome: data.nome,
        telefone: data.telefone || null,
        endereco: data.endereco || null,
        codigoPostal: data.codigoPostal || null
      },
      include: {
        casos: {
          include: {
            estado: true
          },
          orderBy: {
            criado_em: 'desc'
          }
        }
      }
    });

    return updatedClient;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Falha ao atualizar perfil do cliente');
  }
}