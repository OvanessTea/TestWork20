import { create } from 'zustand';
import { Category } from '@/types/category';
import { createJSONStorage, persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { handleApiError } from '@/utils/handleApiError';

interface CategoryStore {
    categories: Category[];
    isLoading: boolean;
    lastFetched: number | null;
    getCategories: () => Promise<boolean>;
}

const CACHE_DURATION = 5 * 60 * 1000;

const useCategoryStore = create<CategoryStore>()(
    persist((set, get) => ({
        categories: [],
        isLoading: false,
        lastFetched: null,
        getCategories: async () => {
            try {
                const now = typeof window !== 'undefined' ? Date.now() : 0;
                const lastFetched = get().lastFetched;
                
                // Return cached data if it's still valid
                if (lastFetched && now - lastFetched < CACHE_DURATION && get().categories.length > 0) {
                    return true;
                }

                set({ isLoading: true });
                const response = await api.get('/products/categories');
                set({ 
                    categories: response.data,
                    lastFetched: now
                });
                return true;
            } catch (error) {
                const message =
                error instanceof AxiosError
                    ? error.response?.data.message
                    : 'Failed to fetch products';
                const code = error instanceof AxiosError ? error?.status : 500;
                handleApiError(error, code ?? 500, message);
                return false;
            } finally {
                set({ isLoading: false });
            }
        }
    }), {
        name: 'category-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ 
            categories: state.categories,
            lastFetched: state.lastFetched 
        }),
    })
);

export { useCategoryStore };
