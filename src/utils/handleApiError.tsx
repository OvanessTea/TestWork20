import useErrorStore from '@/store/error/useErrorStore';

export function handleApiError(err: unknown, code: number, fallbackMsg = 'Something went wrong') {
  console.error(err);
  
  useErrorStore.getState().setError(fallbackMsg);
  useErrorStore.getState().setCode(code);
}