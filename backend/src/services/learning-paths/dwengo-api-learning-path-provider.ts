import { fetchWithLogging } from '../../util/api-helper.js';
import { DWENGO_API_BASE } from '../../config.js';
import { LearningPathProvider } from './learning-path-provider.js';
import { getLogger, Logger } from '../../logging/initalize.js';
import { LearningPath, LearningPathResponse } from '@dwengo-1/common/interfaces/learning-content';
import { Teacher } from '../../entities/users/teacher.entity';
import { Language } from '@dwengo-1/common/util/language';

const logger: Logger = getLogger();

const dwengoApiLearningPathProvider: LearningPathProvider = {
    async fetchLearningPaths(hruids: string[], language: string, source: string): Promise<LearningPathResponse> {
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

        const learningPaths = await fetchWithLogging<LearningPath[]>(apiUrl, `Learning paths for ${source}`, { params });

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
    },

    async searchLearningPaths(query: string, language: string): Promise<LearningPath[]> {
        const apiUrl = `${DWENGO_API_BASE}/learningPath/search`;
        const params = { all: query, language };

        const searchResults = await fetchWithLogging<LearningPath[]>(apiUrl, `Search learning paths with query "${query}"`, { params });
        return searchResults ?? [];
    },

    async searchLearningPathsByAdmin(admins: Teacher[], language: string): Promise<LearningPath[]> {
        if (!admins || admins.length === 0) {
            return this.searchLearningPaths('', language as Language);
        }

        // Dwengo API does not have the concept of admins, so we cannot filter by them.
        return []
    },
};

export default dwengoApiLearningPathProvider;
