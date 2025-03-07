import { fetchWithLogging } from '../util/apiHelper.js';
import { DWENGO_API_BASE } from '../config.js';
import { LearningPath, LearningPathResponse } from '../interfaces/learningPath.js';
import { getLogger, Logger } from '../logging/initalize.js';

const logger: Logger = getLogger();

export async function fetchLearningPaths(hruids: string[], language: string, source: string): Promise<LearningPathResponse> {
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

    const learningPaths = await fetchWithLogging<LearningPath[]>(apiUrl, `Learning paths for ${source}`, params);

    if (!learningPaths || learningPaths.length === 0) {
        logger.warn(`⚠️ WARNING: No learning paths found for ${source}.`);
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

export async function searchLearningPaths(query: string, language: string): Promise<LearningPath[]> {
    const apiUrl = `${DWENGO_API_BASE}/learningPath/search`;
    const params = { all: query, language };

    const searchResults = await fetchWithLogging<LearningPath[]>(apiUrl, `Search learning paths with query "${query}"`, params);
    return searchResults ?? [];
}
