import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

const access_config = {
    publicPaths: ['/_next', '/favicon.ico', '/images'],
    authPages: ['/login', '/register', '/forgot-password', '/definir-password', '/forbidden'],
    rolePaths: {
        '/criar-colaborador': 1,  // COLAB 
        '/criar-cliente': 2,  // COLAB 
        '/criar-caso': 2,  // COLAB 
        '/criar-evento': 2,  // COLAB
    }
};

export default withAuth(
    async function middleware(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth?.token;


        if (token) {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/checkblocked?id=${token?.id}`);
            const data = await res.json();
            console.log('res', data);

            if (data.isBlocked && pathname !== '/forbidden') {
                return NextResponse.redirect(new URL('/forbidden', req.url));
            }

            if (access_config.authPages.some(p => pathname.startsWith(p)) && !data.isBlocked) {
                return token ? NextResponse.redirect(new URL('/', req.url)) : NextResponse.next();
            }
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
            error: '/unauthorized',

        },
    }
);

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|public|site.webmanifest).*)'],
};