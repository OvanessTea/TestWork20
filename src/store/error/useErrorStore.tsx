import { create } from 'zustand';

interface ErrorStore {
    error: string | null;
    code: number | null;
    setError: (error: string | null) => void;
    setCode: (code: number | null) => void;
}

const useErrorStore = create<ErrorStore>((set) => ({
    error: null,
    code: null,
    setError: (error: string | null) => set({ error }),
    setCode: (code: number | null) => set({ code }),
}));

export default useErrorStore;

