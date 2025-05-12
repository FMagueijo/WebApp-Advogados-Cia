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