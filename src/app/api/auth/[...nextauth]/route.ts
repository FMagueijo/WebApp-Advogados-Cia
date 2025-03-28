import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createConnection } from 'mysql2/promise';
import { compare } from 'bcryptjs';

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
                    const connection = await createConnection({
                        host: process.env.DB_HOST,
                        user: process.env.DB_USER,
                        password: process.env.DB_PASSWORD,
                        database: process.env.DB_NAME,
                        port: Number(process.env.DB_PORT) || 3306
                    });

                    const [rows] = await connection.execute(
                        'SELECT id, email, password_hash, role_id FROM utilizador WHERE email = ?',
                        [credentials.email]
                    );

                    await connection.end();

                    const user = (rows as any)[0];
                    if (!user) return null;

                    const isValid = await compare(credentials.password, user.password_hash);
                    if (!isValid) return null;

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        role: user.role_id
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