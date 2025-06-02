import { create } from 'zustand';
import { Category } from "@/types/category"
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface CategoryStore {
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

const useCategoryStore = create<CategoryStore>()(devtools(persist((set) => ({
    categories: [],
    setCategories: (categories) => set({ categories }),
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
    error: null,
    setError: (error) => set({ error }),
}), {
    name: 'category-store',
    partialize: (state) => ({ categories: state.categories }),
    storage: createJSONStorage(() => localStorage),
}), {
    name: 'CategoryStore',
    enabled: process.env.NODE_ENV === 'development',
}));

export { useCategoryStore };

