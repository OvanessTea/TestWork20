import { create } from 'zustand';
import { Product } from '@/types/product';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AxiosError } from 'axios';
import api from '@/lib/axios';

interface ProductStore {
    products: Product[];
    total: number;
    limit: number;
    skip: number;
    isLoading: boolean;
    error: string | null;
    getProducts: (searchParams: string) => Promise<boolean>;
}

const useProductStore = create<ProductStore>()(persist((set) => ({
    products: [] as Product[],
    total: 0,
    limit: 0,
    skip: 0,
    isLoading: false,
    error: null,
    getProducts: async (searchParams: string) => {
        try {
            set({ isLoading: true });
            const response = await api.get('/products' + searchParams + '&limit=12&select=id,title,category,price,thumbnail');
            set({ products: response.data.products, total: response.data.total, limit: response.data.limit, skip: response.data.skip });
            return true;
        } catch (error) {
            const message =
                error instanceof AxiosError
                    ? error.response?.data.message
                    : 'Failed to fetch products';
            set({ error: message });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },
}), {
    name: 'product-store', // key for the store in the browser
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ products: state.products }),
}));

export { useProductStore };


