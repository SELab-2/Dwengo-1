import { Language } from 'dwengo-1-common/src/util/language.js';
import { PersonalizationTarget } from './learning-path-personalization-util.js';
import { LearningPath, LearningPathResponse } from 'dwengo-1-common/src/interfaces/learning-content';

/**
 * Generic interface for a service which provides access to learning paths from a data source.
 */
export interface LearningPathProvider {
    /**
     * Fetch the learning paths with the given hruids from the data source.
     */
    fetchLearningPaths(hruids: string[], language: Language, source: string, personalizedFor?: PersonalizationTarget): Promise<LearningPathResponse>;

    /**
     * Search learning paths in the data source using the given search string.
     */
    searchLearningPaths(query: string, language: Language, personalizedFor?: PersonalizationTarget): Promise<LearningPath[]>;
}
