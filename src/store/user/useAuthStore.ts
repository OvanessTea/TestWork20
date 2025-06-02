import { create } from 'zustand';
import api from '@/lib/axios';
import { CurrentUser } from '@/types/user';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
    user: CurrentUser | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    getProfile: () => Promise<void>;
    refreshToken: () => Promise<void>;
    error: string | null;
    isLoading: boolean;
}

const useAuthStore = create<AuthState>()(
    persist((set) => ({
        user: null,
        isLoading: false,
        error: null,
        login: async (username: string, password: string) => {
            if (password.length < 3) {
                set({ error: 'Password must be at least 3 characters long' });
                return;
            }
            try {
                set({ isLoading: true });
                const response = await api.post('/auth/login', { username, password });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                set({ user: response.data });
                set({ error: null });
            } catch (error) {
                set({ error: 'Failed to login' });
            } finally {
                set({ isLoading: false });
            }
        },
        getProfile: async () => {
            try {
                set({ isLoading: true });
                const response = await api.get('/auth/me');
                set({ user: response.data });
            } catch (error) {
                set({ error: 'Failed to fetch profile' });
            } finally {
                set({ isLoading: false });
            }
        },
        refreshToken: async () => {
            try {
                const response = await api.post('/auth/refresh', {
                    refreshToken: localStorage.getItem('refreshToken'),
                });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
            } catch (error) {
                set({ error: 'Failed to refresh token' });
            }
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            set({ user: null });
        }
    }), {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ user: state.user })
    })
);

export default useAuthStore;
