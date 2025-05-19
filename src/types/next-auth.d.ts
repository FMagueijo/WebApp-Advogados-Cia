import 'next-auth';

declare module 'next-auth' {
    interface User {
        id?: string;
        role?: number;
        blocked?: boolean;
        error?: string;
    }

    interface Session {
        user: {
            id?: string;
            role?: number;
            email: string;
            blocked?: boolean;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        role?: number;
        blocked?: boolean;
    }
}
