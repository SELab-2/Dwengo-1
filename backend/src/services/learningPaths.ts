import { fetchWithLogging } from "../util/apiHelper.js";
import { DWENGO_API_BASE } from "../config/config.js";

interface LearningPathResponse {
    success: boolean;
    source: string;
    data: any[] | null;
    message?: string;
}

export async function fetchLearningPaths(
    hruids: string[],
    language: string,
    source: string
): Promise<LearningPathResponse> {
    if (hruids.length === 0) {
        return {
            success: false,
            source,
            data: null,
            message: `No HRUIDs provided for ${source}.`,
        };
    }

    const apiUrl = `${DWENGO_API_BASE}/learningPath/getPathsFromIdList`;
    const params = { pathIdList: JSON.stringify({ hruids }), language };

    const learningPaths = await fetchWithLogging<any>(apiUrl, `Learning paths for ${source}`, params);

    if (!learningPaths || learningPaths.length === 0) {
        console.error(`⚠️ WARNING: No learning paths found for ${source}.`);
        return {
            success: false,
            source,
            data: [],
            message: `No learning paths found for ${source}.`,
        };
    }

    return {
        success: true,
        source,
        data: learningPaths,
    };
}
