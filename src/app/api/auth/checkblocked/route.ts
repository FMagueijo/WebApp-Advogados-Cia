import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (user && user.esta_bloqueado) {
            return NextResponse.json({ isBlocked: true }, { status: 200 });
        } else {
            return NextResponse.json({ isBlocked: false }, { status: 200 });
        }
    } catch (error) {
        console.error("Error checking blocked status", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
} 