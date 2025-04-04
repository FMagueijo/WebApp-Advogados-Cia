import 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        role?: number;
    }

    interface Session {
        user: {
            id: string;
            role?: number;
            email: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role?: number;
    }
}