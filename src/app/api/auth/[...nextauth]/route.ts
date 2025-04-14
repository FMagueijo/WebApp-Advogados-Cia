import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
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
                    return { error: 'Credenciais inválidas.' };
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
                            esta_bloqueado: true
                        },
                    });

                    if (!user) return { error: 'Email ou password inválidos. Tente novamente.' };
    
                    const isPasswordValid = user.password_hash ? await compare(credentials.password, user.password_hash) : false;

                    if (!isPasswordValid) return { error: 'Email ou password inválidos. Por favor, tente novamente.' }; 
                    if (user.esta_bloqueado) return { error: 'Utilizador Bloqueado.' };   

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        role: user.role_id ?? undefined,
                        blocked: user.esta_bloqueado ?? false,
                    };
                } catch (error) {
                    console.error('Authentication error:', error);
                    return { error: error  }
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.blocked = user.blocked;
            }
            return token;
        },
        async session({ session, token }) {

            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                const user = await prisma.user.findUnique({
                    where: { id: Number(token.id) },
                });
                
                session.user.blocked = user?.esta_bloqueado ?? false; 
            }
            return session;
        },
        async signIn({ user, account, profile, email, credentials }) {
            if (user?.error) {
                throw new Error(user.error)
            }
            return true
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