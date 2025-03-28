// components/auth-loader.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function AuthLoader({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status !== 'loading') {
            const timer = setTimeout(() => setIsLoading(false), 300); // Short delay for smooth transition
            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            {children}
        </div>
    );
}