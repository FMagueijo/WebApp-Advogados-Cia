// actions.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitRegistroHoras(data: {
  casoId: number;
  colaboradorId: number; // Será mapeado para user_id
  tempo: string; // Formato "HH:MM"
  data: string; // Formato ISO ou datetime-local
  descricao: string;
}) {
  try {
    // Validação dos dados
    if (!data.casoId || isNaN(data.casoId)) {
      return { error: 'ID do caso inválido' };
    }
    
    if (!data.colaboradorId || isNaN(data.colaboradorId)) {
      return { error: 'ID do colaborador inválido' };
    }


    // Converter tempo para float (horas decimais)
    const [hours, minutes] = data.tempo.split(':').map(Number);
    const horasDecimais = hours + (minutes / 60);

    // Validar e formatar data
    const dataRegistro = data.data ? new Date(data.data) : new Date();
    if (isNaN(dataRegistro.getTime())) {
      return { error: 'Data inválida' };
    }

    // Verificar existência do caso e usuário
    const [casoExists, userExists] = await Promise.all([
      prisma.caso.findUnique({ where: { id: data.casoId } }),
      prisma.user.findUnique({ where: { id: data.colaboradorId } })
    ]);

    if (!casoExists) {
      return { error: 'Caso não encontrado' };
    }
    if (!userExists) {
      return { error: 'Colaborador não encontrado' };
    }

    // Criar registro no banco de dados
    const registro = await prisma.horasTrabalhadas.create({
      data: {
        horas: horasDecimais,
        data: dataRegistro,
        caso_id: data.casoId,
        user_id: data.colaboradorId,
        // Adicione descrição se seu modelo tiver esse campo
        // Ou crie uma tabela relacionada para observações se necessário
      },
      include: {
        caso: true,
        user: true
      }
    });

    // Atualizar cache da página
    revalidatePath(`/caso/${data.casoId}`);

    return { 
      success: true,
      message: `Horas registradas com sucesso! (${registro.horas}h)`,
      registro: {
        id: registro.id,
        horas: registro.horas,
        data: registro.data.toISOString()
      }
    };

  } catch (error) {
    console.error('Erro ao registrar horas:', error);
    
    if (error instanceof Error) {
      return { 
        error: `Erro no servidor: ${error.message}`,
        code: 'DATABASE_ERROR'
      };
    }
    
    return { 
      error: 'Ocorreu um erro desconhecido ao registrar horas',
      code: 'UNKNOWN_ERROR'
    };
  }
}