import { create } from 'zustand';
import api from '@/lib/axios';
import { CurrentUser } from '@/types/user';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AxiosError } from 'axios';
import { handleApiError } from '@/utils/handleApiError';

interface AuthState {
    user: CurrentUser | null;
    authError: string | null;
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
        authError: null,
        login: async (username: string, password: string) => {
            if (password.length < 3) {
                set({ authError: 'Password must be at least 3 characters long' });
                return false;
            }
            try {
                set({ isLoading: true });
                const response = await api.post('/auth/login', { username, password });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                set({ user: response.data });
                set({ authError: null });
                return true;
            } catch (error) {
                if (error instanceof AxiosError) {
                    set({ authError: error.response?.data.message });
                } else {
                    set({ authError: 'Failed to login' });
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
                const message =
                    error instanceof AxiosError
                        ? error.response?.data.message
                        : 'Failed to fetch profile';
                const code = error instanceof AxiosError ? error?.status : 500;
                handleApiError(error, code ?? 500, message);
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
                const message =
                    error instanceof AxiosError
                        ? error.response?.data.message
                        : 'Failed to refresh token';
                const code = error instanceof AxiosError ? error?.status : 500;
                handleApiError(error, code ?? 500, message);
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
