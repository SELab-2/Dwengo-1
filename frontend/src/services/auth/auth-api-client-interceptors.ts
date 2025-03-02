import apiClient from "@/services/api-client.ts";
import type {AuthState} from "@/services/auth/auth-types.ts";

export function configureApiClientAuthInterceptors(authState: AuthState, renewToken: () => Promise<any>) {
    apiClient.interceptors.request.use(async (reqConfig) => {
        const token = authState?.user?.access_token;
        if (token) {
            reqConfig.headers.Authorization = `Bearer ${token}`;
        }
        return reqConfig;
    }, (error) => Promise.reject(error));

    apiClient.interceptors.response.use(
        response => response,
        async (error) => {
            if (error.response?.status === 401) {
                console.log("Access token expired, trying to refresh...");
                await renewToken();
                return apiClient(error.config); // Retry the request
            }
            return Promise.reject(error);
        }
    );
}
