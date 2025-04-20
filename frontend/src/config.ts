export const apiConfig = {
    baseUrl: ((): string => {
        if (import.meta.env.VITE_API_BASE_URL) {
            return import.meta.env.VITE_API_BASE_URL;
        }

        if (
            window.location.hostname === "localhost" &&
            !(window.location.port === "80" || window.location.port === "")
        ) {
            return "http://localhost:3000/api";
        }

        // Fallback to the current origin with "/api" suffix
        return `${window.location.origin}/api`;
    })(),
};

export const loginRoute = "/login";
