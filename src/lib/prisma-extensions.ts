// lib/prisma-extensions.ts
import { PrismaClient } from '@prisma/client';
import { getCurrentUserId } from './context';

// Função auxiliar para criar notificações
async function createNotification(
    prisma: any,
    titulo: string,
    mensagem: string,
    tipo: 'GERAL' | 'SISTEMA' | 'EVENTO' | 'PRAZO' | 'ALERTA' | 'FINANCEIRO' | 'USUARIO',
    criadorId: number,
    receptorIds: number[]
) {
    try {
        // Criar a notificação
        const notificacao = await prisma.notificacao.create({
            data: {
                titulo,
                mensagem,
                tipo,
                criador_id: criadorId,
            },
        });

        // Criar registros para cada receptor
        const notificacoesRecebidas = receptorIds.map(receptorId => ({
            user_id: receptorId,
            notificacao_id: notificacao.id,
        }));

        await prisma.notificacaoRecebida.createMany({
            data: notificacoesRecebidas,
            skipDuplicates: true,
        });

        return notificacao;
    } catch (error) {
        console.error('Erro ao criar notificação:', error);
    }
}

// Função para obter todos os usuários (exceto o criador)
async function getAllUsersExcept(prisma: any, excludeUserId: number): Promise<number[]> {
    const users = await prisma.user.findMany({
        where: {
            id: { not: excludeUserId },
            esta_bloqueado: false,
        },
        select: { id: true },
    });
    return users.map((user: any) => user.id);
}

// Função para obter colaboradores de um evento
async function getEventoColaboradores(prisma: any, eventoId: string): Promise<number[]> {
    const evento = await prisma.evento.findUnique({
        where: { id: eventoId },
        include: {
            users: {
                select: { id: true },
            },
        },
    });
    return evento?.users.map((user: any) => user.id) || [];
}

export const prisma = new PrismaClient().$extends({
    name: 'notificationExtension',
    query: {
        // Notificações para Cliente
        cliente: {
            async create({ args, query }) {
                const result = await query(args);
                const userId = getCurrentUserId();
                if (!userId) return result;

                const receptores = await getAllUsersExcept(prisma, userId);
                await createNotification(
                    prisma,
                    'Novo Cliente Cadastrado',
                    `Um novo cliente "${result.nome}" foi cadastrado no sistema.`,
                    'SISTEMA',
                    userId,
                    receptores
                );

                return result;
            },
            async update({ args, query }) {
                const result = await query(args);
                const userId = getCurrentUserId();
                if (!userId) return result;

                const receptores = await getAllUsersExcept(prisma, userId);
                await createNotification(
                    prisma,
                    'Cliente Atualizado',
                    `As informações do cliente "${result.nome}" foram atualizadas.`,
                    'SISTEMA',
                    userId,
                    receptores
                );

                return result;
            },
        },

        // Notificações para Caso
        caso: {
            async create({ args, query }) {
                const result = await query(args);
                const userId = getCurrentUserId();
                if (!userId) return result;

                // Buscar informações do cliente para a notificação
                const casoCompleto = await prisma.caso.findUnique({
                    where: { id: result.id },
                    include: { cliente: true },
                });

                const receptores = await getAllUsersExcept(prisma, userId);
                await createNotification(
                    prisma,
                    'Novo Caso Criado',
                    `Um novo caso "${result.processo}" foi criado para o cliente "${casoCompleto?.cliente.nome}".`,
                    'SISTEMA',
                    userId,
                    receptores
                );

                return result;
            },
            async update({ args, query }) {
                const result = await query(args);
                const userId = getCurrentUserId();
                if (!userId) return result;

                const casoCompleto = await prisma.caso.findUnique({
                    where: { id: result.id },
                    include: { cliente: true, estado: true },
                });

                const receptores = await getAllUsersExcept(prisma, userId);
                await createNotification(
                    prisma,
                    'Caso Atualizado',
                    `O caso "${result.processo}" do cliente "${casoCompleto?.cliente.nome}" foi atualizado.`,
                    'SISTEMA',
                    userId,
                    receptores
                );

                return result;
            },
        },

        // Notificações para Registro
        registro: {
            async create({ args, query }) {
                const result = await query(args);
                const userId = getCurrentUserId();
                if (!userId) return result;

                // Buscar informações do caso e cliente
                const registroCompleto = await prisma.registro.findUnique({
                    where: { id: result.id },
                    include: {
                        caso: {
                            include: { cliente: true },
                        },
                    },
                });

                const receptores = await getAllUsersExcept(prisma, userId);
                await createNotification(
                    prisma,
                    'Novo Registro Adicionado',
                    `Um novo registro "${result.resumo}" foi adicionado ao caso "${registroCompleto?.caso.processo}" do cliente "${registroCompleto?.caso.cliente.nome}".`,
                    'SISTEMA',
                    userId,
                    receptores
                );

                return result;
            },
            async update({ args, query }) {
                const result = await query(args);
                const userId = getCurrentUserId();
                if (!userId) return result;

                const registroCompleto = await prisma.registro.findUnique({
                    where: { id: result.id },
                    include: {
                        caso: {
                            include: { cliente: true },
                        },
                    },
                });

                const receptores = await getAllUsersExcept(prisma, userId);
                await createNotification(
                    prisma,
                    'Registro Atualizado',
                    `O registro "${result.resumo}" do caso "${registroCompleto?.caso.processo}" foi atualizado.`,
                    'SISTEMA',
                    userId,
                    receptores
                );

                return result;
            },
        },

        // Notificações para Evento
        evento: {
            async create({ args, query }) {
                const result = await query(args);
                const userId = getCurrentUserId();
                if (!userId) return result;

                // Determinar receptores baseado nos colaboradores do evento
                let receptores: number[] = [];

                if (args.data.users && args.data.users.connect) {
                    // Se há colaboradores específicos, notificar apenas eles
                    const colaboradorIds = Array.isArray(args.data.users.connect)
                        ? args.data.users.connect.map((user: any) => user.id)
                        : [args.data.users.connect.id];
                    receptores = colaboradorIds.filter(id => id !== userId);
                } else {
                    // Se não há colaboradores específicos, notificar todos os usuários
                    receptores = await getAllUsersExcept(prisma, userId);
                }

                const tipoNotificacao = result.tipo === 'PRAZO_PROCESSUAL' ? 'PRAZO' : 'EVENTO';

                await createNotification(
                    prisma,
                    `Novo ${result.tipo === 'PRAZO_PROCESSUAL' ? 'Prazo Processual' : 'Evento'} Criado`,
                    `Um novo ${result.tipo.toLowerCase().replace('_', ' ')} "${result.titulo}" foi agendado para ${new Date(result.data).toLocaleDateString('pt-BR')}.`,
                    tipoNotificacao,
                    userId,
                    receptores
                );

                return result;
            },
            async update({ args, query }) {
                const result = await query(args);
                const userId = getCurrentUserId();
                if (!userId) return result;

                // Obter colaboradores atuais do evento
                const colaboradores = await getEventoColaboradores(prisma, result.id);
                const receptores = colaboradores.filter(id => id !== userId);

                // Se não há colaboradores, notificar todos
                const receptoresFinais = receptores.length > 0 ? receptores : await getAllUsersExcept(prisma, userId);

                const tipoNotificacao = result.tipo === 'PRAZO_PROCESSUAL' ? 'PRAZO' : 'EVENTO';

                await createNotification(
                    prisma,
                    `${result.tipo === 'PRAZO_PROCESSUAL' ? 'Prazo Processual' : 'Evento'} Atualizado`,
                    `O ${result.tipo.toLowerCase().replace('_', ' ')} "${result.titulo}" foi atualizado.`,
                    tipoNotificacao,
                    userId,
                    receptoresFinais
                );

                return result;
            },
        },

        // Notificações para Divida
        divida: {
            async create({ args, query }) {
                const result = await query(args);
                const userId = getCurrentUserId();
                if (!userId) return result;

                // Buscar informações do cliente e caso
                const dividaCompleta = await prisma.divida.findUnique({
                    where: { id: result.id },
                    include: {
                        cliente: true,
                        caso: true,
                    },
                });

                const receptores = await getAllUsersExcept(prisma, userId);
                await createNotification(
                    prisma,
                    'Nova Dívida Registrada',
                    `Uma nova dívida de R$ ${result.valor.toFixed(2)} foi registrada para o cliente "${dividaCompleta?.cliente.nome}" no caso "${dividaCompleta?.caso.processo}".`,
                    'FINANCEIRO',
                    userId,
                    receptores
                );

                return result;
            },
            async update({ args, query }) {
                const result = await query(args);
                const userId = getCurrentUserId();
                if (!userId) return result;

                const dividaCompleta = await prisma.divida.findUnique({
                    where: { id: result.id },
                    include: {
                        cliente: true,
                        caso: true,
                    },
                });

                const statusTexto = result.pago ? 'foi marcada como paga' : 'foi atualizada';
                const tipoNotificacao = result.pago ? 'FINANCEIRO' : 'SISTEMA';

                const receptores = await getAllUsersExcept(prisma, userId);
                await createNotification(
                    prisma,
                    result.pago ? 'Dívida Paga' : 'Dívida Atualizada',
                    `A dívida de R$ ${result.valor.toFixed(2)} do cliente "${dividaCompleta?.cliente.nome}" no caso "${dividaCompleta?.caso.processo}" ${statusTexto}.`,
                    tipoNotificacao,
                    userId,
                    receptores
                );

                return result;
            },
        },
    },
});

// Função utilitária para marcar notificações como lidas
export async function marcarNotificacaoComoLida(notificacaoId: number, userId: number) {
    return await prisma.notificacaoRecebida.update({
        where: {
            user_id_notificacao_id: {
                user_id: userId,
                notificacao_id: notificacaoId,
            },
        },
        data: {
            lida: true,
        },
    });
}

// Função para obter notificações não lidas de um usuário
export async function getNotificacoesNaoLidas(userId: number) {
    return await prisma.notificacaoRecebida.findMany({
        where: {
            user_id: userId,
            lida: false,
        },
        include: {
            notificacao: {
                include: {
                    criador: {
                        select: {
                            id: true,
                            nome: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            recebida_em: 'desc',
        },
    });
}

// Função para obter todas as notificações de um usuário (com paginação)
export async function getNotificacoesUsuario(
    userId: number,
    page: number = 1,
    limit: number = 20
) {
    const skip = (page - 1) * limit;

    return await prisma.notificacaoRecebida.findMany({
        where: {
            user_id: userId,
        },
        include: {
            notificacao: {
                include: {
                    criador: {
                        select: {
                            id: true,
                            nome: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            recebida_em: 'desc',
        },
        skip,
        take: limit,
    });
}