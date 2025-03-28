import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const access_config = {
    publicPaths: ['/_next', '/favicon.ico', '/images'],
    authPages: ['/login', '/register', '/forgot-password'],
    rolePaths: {
        '/admin': 1,    // ADMIN 
        '/criar-colaborador': 2,  // COLAB 
    }
};

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth?.token;
        
        if (process.env.NO_AUTH !== undefined) {
            return NextResponse.next();  // Skip authentication if the flag is set
        }
        // Block logged-in users from auth pages
        if (access_config.authPages.some(p => pathname.startsWith(p))) {
            return token ? NextResponse.redirect(new URL('/', req.url)) : NextResponse.next();
        }

        // Check role-based access using configuration
        for (const [path, roles] of Object.entries(access_config.rolePaths)) {
            if (pathname.startsWith(path)) {
                const allowedRoles = Array.isArray(roles) ? roles : [roles];
                if (!allowedRoles.includes(token?.role as number)) {
                    return NextResponse.redirect(new URL('/unauthorized', req.url));
                }
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Allow public paths
                if ([...access_config.publicPaths, ...access_config.authPages].some(p => pathname.startsWith(p))) {
                    return true;
                }

                // Require authentication for all other paths
                return !!token;
            },
        },
        pages: {
            error: '/unauthorized'
        },
    }
);

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|public|site.webmanifest).*)'],
};