"use server"
import prisma from '@/lib/prisma';
import { TipoEvento } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function criarEvento(formData: FormData, created_by: number, tipo: TipoEvento, colaboradores: any[], casos: any[]) {
    try {
        const titulo = formData.get('Titulo') as string;
        const descricao = formData.get('Descrição') as string;
        const data = formData.get('Data') as string;
        const localizacao = formData.get('Local') as string;
        

        if (!titulo || !data) {
            throw new Error('Título, Data e User ID são obrigatórios');
        }

        const novoEvento = await prisma.evento.create({
            data: {
                titulo,
                descricao: descricao || null,
                data: new Date(data),
                local: localizacao || null,
                tipo: tipo,
                user_id: created_by,
                casos: {
                    connect: casos.map((caso) => ({ id: caso.id })),
                },
                users: {
                    connect: colaboradores.map((colaborador) => ({ id: colaborador.id })),
                },
            },
        });

        console.log('Evento criado com sucesso:', novoEvento);

    } catch (error) {
        console.error('Erro ao criar evento:', error);
        throw error;
    }

    revalidatePath('/agenda');
    redirect('/agenda');
}