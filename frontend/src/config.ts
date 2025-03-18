export const apiConfig = {
    baseUrl:
        window.location.hostname === "localhost" && !(window.location.port === "80" || window.location.port === "")
            ? "http://localhost:3000/api"
            : window.location.origin + "/api",
};

export const loginRoute = "/login";
