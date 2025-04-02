import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createConnection } from 'mysql2/promise';
import { compare } from 'bcryptjs';
import prisma from '@/lib/prisma';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email,
                        },
                        select: {
                            id: true,
                            email: true,
                            password_hash: true,
                            role_id: true,
                        },
                    });

                    if (!user) return null;

                    const isValid = user.password_hash ? await compare(credentials.password, user.password_hash) : false;
                    if (!isValid) return null;

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        role: user.role_id ?? undefined
                    };
                } catch (error) {
                    console.error('Authentication error:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login',
        signOut: '/logout',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60 // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development'
});

export { handler as GET, handler as POST };