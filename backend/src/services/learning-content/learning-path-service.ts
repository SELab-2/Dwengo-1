import {LearningContent, LearningPathResponse} from "../../interfaces/learningContent";
import dwengoApiLearningPathProvider from "./dwengo-api/dwengo-api-learning-path-provider";

/**
 * Service providing access to data about learning paths from the appropriate data source (database or Dwengo-api)
 */
const learningPathService = {
    /**
     * Fetch the learning paths with the given hruids from the data source.
     */
    fetchLearningPaths(hruids: string[], language: string, source: string): Promise<LearningPathResponse> {
        return dwengoApiLearningPathProvider.fetchLearningPaths(hruids, language, source);
    },

    /**
     * Search learning paths in the data source using the given search string.
     */
    searchLearningPaths(query: string, language: string): Promise<LearningContent[]> {
        return dwengoApiLearningPathProvider.searchLearningPaths(query, language);
    }
}

export default learningPathService;
