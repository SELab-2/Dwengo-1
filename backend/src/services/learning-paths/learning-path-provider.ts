import { LearningPath, LearningPathResponse } from '../../interfaces/learning-content';
import { Language } from '../../entities/content/language';

/**
 * Generic interface for a service which provides access to learning paths from a data source.
 */
export interface LearningPathProvider {
    /**
     * Fetch the learning paths with the given hruids from the data source.
     */
    fetchLearningPaths(hruids: string[], language: Language, source: string): Promise<LearningPathResponse>;

    /**
     * Search learning paths in the data source using the given search string.
     */
    searchLearningPaths(query: string, language: Language): Promise<LearningPath[]>;
}
