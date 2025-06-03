import { create } from 'zustand';
import { Product } from '@/types/product';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AxiosError } from 'axios';
import api from '@/lib/axios';
import { handleApiError } from '@/utils/handleApiError';

interface ProductStore {
    products: Product[];
    total: number;
    limit: number;
    skip: number;
    isLoading: boolean;
    isFetched: boolean;
    lastFetched: number | null;
    cachedParams: string | null;
    getProducts: (searchParams: string) => Promise<boolean>;
}

const CACHE_DURATION = 5 * 60 * 1000;

const useProductStore = create<ProductStore>()(persist((set, get) => ({
    products: [] as Product[],
    total: 0,
    limit: 0,
    skip: 0,
    isLoading: false,
    isFetched: false,
    lastFetched: null,
    cachedParams: null,
    getProducts: async (searchParams: string) => {
        try {
            const now = typeof window !== 'undefined' ? Date.now() : 0;
            const lastFetched = get().lastFetched;
            const cachedParams = get().cachedParams;

            // Return cached data if params match and cache is still valid
            if (lastFetched && 
                cachedParams === searchParams && 
                now - lastFetched < CACHE_DURATION && 
                get().products.length > 0) {
                set({ isFetched: true });
                return true;
            }

            set({ isLoading: true, isFetched: true });
            const response = await api.get('/products' + searchParams + '&limit=12&select=id,title,category,price,thumbnail');
            set({ 
                products: response.data.products, 
                total: response.data.total, 
                limit: 12, 
                skip: response.data.skip,
                lastFetched: now,
                cachedParams: searchParams
            });
            return true;
        } catch (error) {
            const message =
                error instanceof AxiosError
                    ? error?.message
                    : 'Failed to fetch products';
            const code = error instanceof AxiosError ? error?.status : 500;
            handleApiError(error, code ?? 500, message);
            return false;
        } finally {
            set({ isLoading: false });
        }
    },
}), {
    name: 'product-store', // key for the store in the browser
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ 
        products: state.products,
        lastFetched: state.lastFetched,
        cachedParams: state.cachedParams
    }),
}));

export { useProductStore };
