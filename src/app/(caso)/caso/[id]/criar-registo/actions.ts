'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Tipos para Registros
interface RegistroInput {
  resumo: string;
  descricao?: string | null; // Corrigido para aceitar explicitamente null
  tipo: string;
  casoId: number;
  userId: number;
}

interface RegistroCompleto {
  id: number;
  resumo: string;
  descricao: string | null;
  tipo: string;
  criado_em: Date;
  user: {
    nome: string;
  };
}

// Criar um novo registro
export async function criarRegistro(formData: FormData): Promise<void> {
  // Extrai dados básicos
  const resumo = formData.get('resumo') as string;
  const descricao = formData.get('descricao') as string | null;
  const tipo = formData.get('tipo') as string;
  const userId = parseInt(formData.get('userId') as string);
  const casoId = parseInt(formData.get('casoId') as string);

  // Validação básica
  if (!resumo?.trim() || !tipo?.trim()) {
    throw new Error('Resumo e tipo são obrigatórios');
  }

 if (isNaN(userId)) {
  throw new Error('ID de usuário inválido');
}
  if (isNaN(casoId)) throw new Error('ID de caso inválido');

  try {
    // Cria o registro primeiro
    const registro = await prisma.registro.create({
      data: {
        resumo,
        descricao,
        tipo,
        user_id: userId,
        caso_id: casoId
      }
    });

    // Processa os arquivos se existirem
    const fileEntries = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('file-'));

    for (const [key, file] of fileEntries) {
      if (file instanceof File) {
        const uniqueName = `${uuidv4()}${path.extname(file.name)}`;
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', uniqueName);
        
        const bytes = await file.arrayBuffer();
        await writeFile(uploadPath, Buffer.from(bytes));

        await prisma.documento.create({
          data: {
            nome: file.name,
            caminho: `/uploads/${uniqueName}`,
            tipo: file.type,
            tamanho: file.size,
            registro_id: registro.id
          }
        });
      }
    }

    revalidatePath(`/caso/${casoId}`);
    redirect(`/caso/${casoId}`);

  } catch (error) {
    console.error('Erro ao criar registro:', error);
    throw error;
  }
}

// Função auxiliar para validação
function validarInputRegistro(formData: FormData, userId: string | number, casoId: string | number): RegistroInput {
  const resumo = formData.get('resumo') as string;
  const descricao = formData.get('descricao') as string | null; // Explicitamente string | null
  const tipo = formData.get('tipo') as string;
  const userIdNumber = typeof userId === 'string' ? parseInt(userId) : userId;
  const casoIdNumber = typeof casoId === 'string' ? parseInt(casoId) : casoId;

  if (!resumo?.trim() || !tipo?.trim()) {
    throw new Error('Resumo e tipo são obrigatórios');
  }

  if (isNaN(userIdNumber)) {
    throw new Error('ID de usuário inválido');
  }

  if (isNaN(casoIdNumber)) {
    throw new Error('ID de caso inválido');
  }

  return {
    resumo,
    descricao: descricao || null, // Agora compatível com a interface
    tipo,
    casoId: casoIdNumber,
    userId: userIdNumber
  };
}