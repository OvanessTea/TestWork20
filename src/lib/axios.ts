import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface ExtendedInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add token to request headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor for handling 401 errors (token expired)
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest.url?.includes('/auth') &&
            // try to retake token only once to avoid infinite loop
            !(originalRequest as ExtendedInternalAxiosRequestConfig)._retry
        ) {
            try {
                (originalRequest as ExtendedInternalAxiosRequestConfig)._retry = true;
                const oldRefreshToken = localStorage.getItem('refreshToken');
                if (oldRefreshToken) {
                    // Refresh the token
                    const response = await api.post('/auth/refresh', {
                        refreshToken: oldRefreshToken,
                    });

                    const { accessToken, refreshToken } = response.data;
                    localStorage.setItem('token', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    // Retry the original request
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                // Redirect to login page if token refresh fails
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
