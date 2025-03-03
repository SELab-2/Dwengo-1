import {LearningContent, LearningPathResponse} from "../../interfaces/learningContent";

/**
 * Generic interface for a service which provides access to learning paths from a data source.
 */
export interface LearningPathProvider {
    /**
     * Fetch the learning paths with the given hruids from the data source.
     */
    fetchLearningPaths(hruids: string[], language: string, source: string): Promise<LearningPathResponse>;

    /**
     * Search learning paths in the data source using the given search string.
     */
    searchLearningPaths(query: string, language: string): Promise<LearningContent[]>;
}
