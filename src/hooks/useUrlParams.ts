import { useRouter, useSearchParams } from 'next/navigation';
import { modifyUrl } from '@/utils/modifyUrl';

interface UseUrlParamsReturn {
    updateParams: (updates: Record<string, string | null>) => Promise<void>;
    getParam: (key: string) => string | null;
    removeParam: (key: string) => Promise<void>;
}

export const useUrlParams = (): UseUrlParamsReturn => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateParams = async (updates: Record<string, string | null>) => {
        await modifyUrl((params) => {
            Object.entries(updates).forEach(([key, value]) => {
                if (value === null) {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });
        }).then((url: string) => {
            router.push(url);
        });
    };

    const getParam = (key: string): string | null => {
        return searchParams.get(key);
    };

    const removeParam = async (key: string) => {
        await updateParams({ [key]: null });
    };

    return {
        updateParams,
        getParam,
        removeParam
    };
}; 