import {LearningPathProvider} from "./learning-path-provider";
import {LearningPath, LearningPathResponse} from "../../interfaces/learning-content";

/**
 * Service providing access to data about learning paths from the database.
 */
const databaseLearningPathProvider: LearningPathProvider = {
    /**
     * Fetch the learning paths with the given hruids from the database.
     */
    fetchLearningPaths(hruids: string[], language: string, source: string): Promise<LearningPathResponse> {
        throw new Error("Not yet implemented"); // TODO
    },

    /**
     * Search learning paths in the database using the given search string.
     */
    searchLearningPaths(query: string, language: string): Promise<LearningPath[]> {
        return Promise.resolve([]); // TODO
    }
}

export default databaseLearningPathProvider;
