import {LearningObjectProvider} from "./learning-object-provider";
import {
    FilteredLearningObject,
    LearningObjectIdentifier,
    LearningPathIdentifier
} from "../../interfaces/learning-content";

/**
 * Service providing access to data about learning objects from the database
 */
const databaseLearningObjectProvider: LearningObjectProvider = {
    /**
     * Fetches a single learning object by its HRUID
     */
    getLearningObjectById(id: LearningObjectIdentifier): Promise<FilteredLearningObject | null> {
        return Promise.resolve(null); // TODO
    },

    /**
     * Fetch full learning object data (metadata)
     */
    getLearningObjectHTML(id: LearningObjectIdentifier): Promise<string | null> {
        return Promise.resolve(null); // TODO
    },

    /**
     * Fetch only learning object HRUIDs
     */
    getLearningObjectIdsFromPath(id: LearningPathIdentifier): Promise<string[]> {
        return Promise.resolve([]);// TODO
    },

    /**
     * Obtain a HTML-rendering of the learning object with the given identifier (as a string).
     */
    getLearningObjectsFromPath(id: LearningPathIdentifier): Promise<FilteredLearningObject[]> {
        return Promise.resolve([]); // TODO
    }

}

export default databaseLearningObjectProvider;
