import { CurrentUser } from '@/types/user';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface UserStore {
    user: CurrentUser | null;
    setUser: (user: CurrentUser) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    logout: () => void;
    error: string | null;
    setError: (error: string | null) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

const useUserStore = create<UserStore>()(devtools(persist((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    logout: () => set({ user: null, isLoggedIn: false }),
    error: null,
    setError: (error) => set({ error }),
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
}), {
    name: 'user-store', // key for the store in the browser
    partialize: (state) => ({ user: state.user }),
    storage: createJSONStorage(() => localStorage),
}),
    {
        name: 'UserStore', // key for devtools
        enabled: process.env.NODE_ENV === 'development',
    }
))

export { useUserStore };
