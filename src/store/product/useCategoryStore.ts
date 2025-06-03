import { create } from 'zustand';
import { Category } from '@/types/category';
import { createJSONStorage, persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { handleApiError } from '@/utils/handleApiError';

interface CategoryStore {
    categories: Category[];
    isLoading: boolean;
    getCategories: () => Promise<boolean>;
}

const useCategoryStore = create<CategoryStore>()(
    persist((set) => ({
        categories: [],
        isLoading: false,
        getCategories: async () => {
            try {
                set({ isLoading: true });
                const response = await api.get('/products/categories');
                set({ categories: response.data });
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
        partialize: (state) => ({ categories: state.categories }),
    })
);

export { useCategoryStore };

