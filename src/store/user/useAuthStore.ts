import { create } from 'zustand';
import api from '@/lib/axios';
import { CurrentUser } from '@/types/user';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AxiosError } from 'axios';

interface AuthState {
    user: CurrentUser | null;
    error: string | null;
    isLoading: boolean;
    login: (_username: string, _password: string) => Promise<boolean>;
    logout: () => void;
    getProfile: () => Promise<void>;
    refreshToken: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
    persist((set) => ({
        user: null,
        isLoading: false,
        error: null,
        login: async (username: string, password: string) => {
            if (password.length < 3) {
                set({ error: 'Password must be at least 3 characters long' });
                return false;
            }
            try {
                set({ isLoading: true });
                const response = await api.post('/auth/login', { username, password });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                set({ user: response.data });
                set({ error: null });
                return true;
            } catch (error) {
                if (error instanceof AxiosError) {
                    set({ error: error.response?.data.message });
                } else {
                    set({ error: 'Failed to login' });
                }
                return false;
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
                if (error instanceof AxiosError) {
                    set({ error: error.response?.data.message });
                } else {
                    set({ error: 'Failed to fetch profile' });
                }
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
                if (error instanceof AxiosError) {
                    set({ error: error.response?.data.message });
                } else {
                    set({ error: 'Failed to refresh token' });
                }
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
