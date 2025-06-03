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
    lastFetched: number | null;
    login: (_username: string, _password: string) => Promise<boolean>;
    logout: () => void;
    getProfile: () => Promise<void>;
    refreshToken: () => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000;

const useAuthStore = create<AuthState>()(
    persist((set, get) => ({
        user: null,
        isLoading: false,
        authError: null,
        lastFetched: null,
        login: async (username: string, password: string) => {
            if (password.length < 3 || username.length < 3) {
                set({ authError: 'Username and password must be at least 3 characters long' });
                return false;
            }
            try {
                set({ isLoading: true });
                const response = await api.post('/auth/login', { username, password });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                set({ 
                    user: response.data,
                    authError: null,
                    lastFetched: typeof window !== 'undefined' ? Date.now() : 0
                });
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
                const now = typeof window !== 'undefined' ? Date.now() : 0;
                const lastFetched = get().lastFetched;
                
                // Return if cached data is still valid
                if (lastFetched && now - lastFetched < CACHE_DURATION && get().user) {
                    return;
                }

                set({ isLoading: true });
                const response = await api.get('/auth/me');
                set({ 
                    user: response.data,
                    lastFetched: now
                });
            } catch (error) {
                const message = 'Failed to fetch profile';
                const code = error instanceof AxiosError ? error?.status : 500;
                handleApiError(code ?? 500, message);
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
                const message = 'Failed to get user data';
                const code = error instanceof AxiosError ? error?.status : 500;
                handleApiError(code ?? 500, message);
            }
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            set({ 
                user: null,
                lastFetched: null
            });
        }
    }), {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ 
            user: state.user,
            lastFetched: state.lastFetched
        })
    })
);

export default useAuthStore;
