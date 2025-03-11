import { LearningPath, LearningPathResponse } from '../../interfaces/learning-content';
import dwengoApiLearningPathProvider from './dwengo-api-learning-path-provider';
import databaseLearningPathProvider from './database-learning-path-provider';
import { EnvVars, getEnvVar } from '../../util/envvars';
import { Language } from '../../entities/content/language';
import {PersonalizationTarget} from "./learning-path-personalization-util";

const userContentPrefix = getEnvVar(EnvVars.UserContentPrefix);
const allProviders = [dwengoApiLearningPathProvider, databaseLearningPathProvider];

/**
 * Service providing access to data about learning paths from the appropriate data source (database or Dwengo-api)
 */
const learningPathService = {
    /**
     * Fetch the learning paths with the given hruids from the data source.
     * @param hruids For each of the hruids, the learning path will be fetched.
     * @param language This is the language each of the learning paths will use.
     * @param source
     * @param personalizedFor If this is set, a learning path personalized for the given group or student will be returned.
     */
    async fetchLearningPaths(
        hruids: string[],
        language: Language,
        source: string,
        personalizedFor?: PersonalizationTarget
    ): Promise<LearningPathResponse> {
        const userContentHruids = hruids.filter((hruid) => hruid.startsWith(userContentPrefix));
        const nonUserContentHruids = hruids.filter((hruid) => !hruid.startsWith(userContentPrefix));

        const userContentLearningPaths = await databaseLearningPathProvider.fetchLearningPaths(userContentHruids, language, source, personalizedFor);
        const nonUserContentLearningPaths = await dwengoApiLearningPathProvider.fetchLearningPaths(
            nonUserContentHruids,
            language,
            source,
            personalizedFor
        );

        const result = (userContentLearningPaths.data || []).concat(nonUserContentLearningPaths.data || []);

        return {
            data: result,
            source: source,
            success: userContentLearningPaths.success || nonUserContentLearningPaths.success,
        };
    },

    /**
     * Search learning paths in the data source using the given search string.
     */
    async searchLearningPaths(query: string, language: Language, personalizedFor?: PersonalizationTarget): Promise<LearningPath[]> {
        const providerResponses = await Promise.all(allProviders.map((provider) => provider.searchLearningPaths(query, language, personalizedFor)));
        return providerResponses.flat();
    },
};

export default learningPathService;
