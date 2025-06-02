import { create } from 'zustand';
import { FormattedProduct } from '@/types/product';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface ProductStore {
    products: FormattedProduct[];
    setProducts: (products: FormattedProduct[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

const useProductStore = create<ProductStore>()(devtools(persist((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
    error: null,
    setError: (error) => set({ error }),
}), {
    name: 'product-store', // key for the store in the browser
    partialize: (state) => ({ products: state.products }),
    storage: createJSONStorage(() => localStorage),
}), {
    name: 'ProductStore', // key for devtools
    enabled: process.env.NODE_ENV === 'development',
}));

export { useProductStore };



