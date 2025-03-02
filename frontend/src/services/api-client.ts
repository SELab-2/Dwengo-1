import axios from "axios";

const apiClient = axios.create({
    baseURL: window.location.hostname == "localhost" ? "http://localhost:3000" : window.location.origin,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;
