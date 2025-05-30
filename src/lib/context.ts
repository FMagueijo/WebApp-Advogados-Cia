// lib/context.ts
import { getServerSession } from 'next-auth';
import prisma from './prisma';


export async function getCurrentUserId(): Promise<number | undefined> {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return undefined;
    }

    const res = await prisma.user.findFirst({
        select: {
            id: true,
        },
        where: {
            email: session.user.email,
        },
    });

    return res?.id;
}