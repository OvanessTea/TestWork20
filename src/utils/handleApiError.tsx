import useErrorStore from '@/store/error/useErrorStore';

export function handleApiError(code: number, message?: string) {
  
  if (message) {
    useErrorStore.getState().setError(message);
    useErrorStore.getState().setCode(code);
    return;
  }

  let userMessage = 'Something went wrong. Please try again later.';

  if (code === 404) {
    userMessage = 'The requested resource could not be found.';
  } else if (code === 400) {
    userMessage = 'Invalid request. Please check the entered data.';
  } else if (code === 401) {
    userMessage = 'You are not authorized. Please login again.';
  } else if (code === 403) {
    userMessage = 'Access to this resource is forbidden.';
  } else if (code >= 500) {
    userMessage = 'Server error. Please try again later.';
  }

  useErrorStore.getState().setError(userMessage);
  useErrorStore.getState().setCode(code);
}