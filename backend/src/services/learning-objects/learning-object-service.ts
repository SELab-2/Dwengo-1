import {
    FilteredLearningObject,
    LearningObjectIdentifier,
    LearningPathIdentifier
} from "../../interfaces/learning-content";
import dwengoApiLearningObjectProvider from "./dwengo-api-learning-object-provider";
import {LearningObjectProvider} from "./learning-object-provider";

function getProvider(id: LearningObjectIdentifier): LearningObjectProvider {
    return dwengoApiLearningObjectProvider
}

/**
 * Service providing access to data about learning objects from the appropriate data source (database or Dwengo-api)
 */
const learningObjectService = {
    /**
     * Fetches a single learning object by its HRUID
     */
    getLearningObjectById(id: LearningObjectIdentifier): Promise<FilteredLearningObject | null> {
        return getProvider(id).getLearningObjectById(id);
    },

    /**
     * Fetch full learning object data (metadata)
     */
    getLearningObjectsFromPath(id: LearningPathIdentifier): Promise<FilteredLearningObject[]> {
        return getProvider(id).getLearningObjectsFromPath(id);
    },

    /**
     * Fetch only learning object HRUIDs
     */
    getLearningObjectIdsFromPath(id: LearningPathIdentifier): Promise<string[]> {
        return getProvider(id).getLearningObjectIdsFromPath(id);
    },

    /**
     * Obtain a HTML-rendering of the learning object with the given identifier (as a string).
     */
    getLearningObjectHTML(id: LearningObjectIdentifier): Promise<string | null> {
        return getProvider(id).getLearningObjectHTML(id);
    }
};

export default learningObjectService;
