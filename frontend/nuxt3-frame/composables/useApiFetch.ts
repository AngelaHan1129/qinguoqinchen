export function useApiFetch(path: string, options?: RequestInit) {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBaseUrl || 'http://localhost:7939';
    return fetch(`${baseUrl}${path}`, options);
}
