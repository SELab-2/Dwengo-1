import {FilteredLearningObject} from "../../interfaces/learningContent";
import dwengoApiLearningObjectProvider from "./dwengo-api/dwengo-api-learning-object-provider";

/**
 * Service providing access to data about learning objects from the appropriate data source (database or Dwengo-api)
 */
const learningObjectService = {
    /**
     * Fetches a single learning object by its HRUID
     */
    getLearningObjectById(hruid: string, language: string): Promise<FilteredLearningObject | null> {
        return dwengoApiLearningObjectProvider.getLearningObjectById(hruid, language);
    },

    /**
     * Fetch full learning object data (metadata)
     */
    getLearningObjectsFromPath(hruid: string, language: string): Promise<FilteredLearningObject[]> {
        return dwengoApiLearningObjectProvider.getLearningObjectsFromPath(hruid, language);
    },

    /**
     * Fetch only learning object HRUIDs
     */
    getLearningObjectIdsFromPath(hruid: string, language: string): Promise<string[]> {
        return dwengoApiLearningObjectProvider.getLearningObjectIdsFromPath(hruid, language);
    }
};

export default learningObjectService;
