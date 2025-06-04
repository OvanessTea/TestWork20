'use client';

import { useEffect } from 'react';
import useAuthStore from '@/store/user/useAuthStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { getProfile, user } = useAuthStore((state) => state);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !user) {
            getProfile();
        }
    }, [getProfile, user]);

    return <>{children}</>;
} 