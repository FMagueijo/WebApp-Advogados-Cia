
"use server";

import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import {hash} from "bcryptjs";
import { redirect } from "next/navigation";

export async function validateToken(token: string) {

    try {
        const tokenRecord = await prisma.tokenPass.findUnique({
            where: { token },
            include: { user: true }
        });
        
        // Token not found or expired
        if (!tokenRecord /*|| (tokenRecord.expiresAt && new Date() > tokenRecord.expiresAt)*/) {
            return { valid: false };
        }

        return {
            valid: true,
            user: {
                id: tokenRecord.user_id,
                nome: tokenRecord.user.nome,
                email: tokenRecord.user.email
            }
        };
    } catch (error) {

        console.log("2");
        console.error('Database error:', error);
        return { valid: false };
    }
}

export async function changePassword(password: string, user: User, ) {

    try {

        const hashedpass = await hash(password, 12);
        await prisma.user.update({
            data: {
                password_hash: hashedpass,
            },
            where: {
                id: user.id
            }
        });

        await prisma.tokenPass.deleteMany({
            where: {
                user_id: user.id
            }
        });
    } catch (error) {
        console.error('Database error:', error);
    }

    redirect("/login");
}