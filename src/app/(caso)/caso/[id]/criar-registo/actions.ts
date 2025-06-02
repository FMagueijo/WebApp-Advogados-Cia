'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Função para upload de arquivos para o Cloudinary
async function uploadToCloudinary(file: File): Promise<{ url: string, public_id: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'casos/documentos'
      },
      (error, result) => {
        if (error) {
          console.error('Erro no upload para Cloudinary:', error);
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Upload failed: no result from Cloudinary'));
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
}

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

    // Processar cada arquivo em paralelo
    const uploadPromises = fileEntries.map(async ([key, file]) => {
      if (file instanceof File) {
        try {
          // Upload para Cloudinary
          const { url, public_id } = await uploadToCloudinary(file);

          // Salvar metadados no banco de dados
           await prisma.documento.create({
            data: {
              nome: file.name,
              caminho: url,
              tipo: file.type,
              tamanho: file.size,
              registro: {
                connect: {
                  id: registro.id
                }
              },
              public_id: public_id
            }
          });
        } catch (error) {
          console.error(`Erro ao processar arquivo ${file.name}:`, error);
          throw error;
        }
      }
    });

    // Aguardar todos os uploads terminarem
    await Promise.all(uploadPromises);

    revalidatePath(`/caso/${casoId}`);
    redirect(`/caso/${casoId}`);

  } catch (error) {
    console.error('Erro ao criar registro:', error);
    throw error;
  }
}