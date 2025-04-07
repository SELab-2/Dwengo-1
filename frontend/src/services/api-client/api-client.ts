import axios from "axios";
import { apiConfig } from "@/config.ts";

const apiClient = axios.create({
    baseURL: apiConfig.baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});
export default apiClient;
