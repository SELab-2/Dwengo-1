import {fetchJson} from "@/controller/fetch.ts";
import {API_BASE} from "../../config.ts";

export const getAllThemes = async (language: string | null = null) => {
    const url = language
        ? `${API_BASE}/theme?language=${encodeURIComponent(language)}`
        : `${API_BASE}/theme`;
    return await fetchJson(url);
};

export const getHruidsByTheme = async (theme: string) => {
    const url = `${API_BASE}/theme/${encodeURIComponent(theme)}`;
    return await fetchJson(url);
};
