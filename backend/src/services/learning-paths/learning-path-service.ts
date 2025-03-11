import { LearningPath, LearningPathResponse } from '../../interfaces/learning-content';
import dwengoApiLearningPathProvider from './dwengo-api-learning-path-provider';
import databaseLearningPathProvider from './database-learning-path-provider';
import { EnvVars, getEnvVar } from '../../util/envvars';
import { Language } from '../../entities/content/language';

const userContentPrefix = getEnvVar(EnvVars.UserContentPrefix);
const allProviders = [dwengoApiLearningPathProvider, databaseLearningPathProvider];

/**
 * Service providing access to data about learning paths from the appropriate data source (database or Dwengo-api)
 */
const learningPathService = {
    /**
     * Fetch the learning paths with the given hruids from the data source.
     */
    async fetchLearningPaths(hruids: string[], language: Language, source: string): Promise<LearningPathResponse> {
        const userContentHruids = hruids.filter((hruid) => hruid.startsWith(userContentPrefix));
        const nonUserContentHruids = hruids.filter((hruid) => !hruid.startsWith(userContentPrefix));

        const userContentLearningPaths = await databaseLearningPathProvider.fetchLearningPaths(userContentHruids, language, source);
        const nonUserContentLearningPaths = await dwengoApiLearningPathProvider.fetchLearningPaths(nonUserContentHruids, language, source);

        return {
            data: (userContentLearningPaths.data || []).concat(nonUserContentLearningPaths.data || []),
            source: source,
            success: userContentLearningPaths.success || nonUserContentLearningPaths.success,
        };
    },

    /**
     * Search learning paths in the data source using the given search string.
     */
    async searchLearningPaths(query: string, language: Language): Promise<LearningPath[]> {
        const providerResponses = await Promise.all(allProviders.map((provider) => provider.searchLearningPaths(query, language)));
        return providerResponses.flat();
    },
};

export default learningPathService;
