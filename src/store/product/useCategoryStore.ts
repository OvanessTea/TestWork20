import { create } from 'zustand';
import { Category } from '@/types/category';
import { createJSONStorage, persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

interface CategoryStore {
    categories: Category[];
    error: string | null;
    isLoading: boolean;
    getCategories: () => Promise<boolean>;
}

const useCategoryStore = create<CategoryStore>()(
    persist((set) => ({
        categories: [],
        error: null,
        isLoading: false,
        getCategories: async () => {
            try {
                set({ isLoading: true });
                const response = await api.get('/products/categories');
                set({ categories: response.data });
                return true;
            } catch (error) {
                if (error instanceof AxiosError) {
                    set({ error: error.response?.data.message });
                } else {
                    set({ error: 'Failed to fetch categories' });
                }
                return false;
            } finally {
                set({ isLoading: false });
            }
        }
    }), {
        name: 'category-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ categories: state.categories }),
    })
);

export { useCategoryStore };

