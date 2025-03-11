import { FilteredLearningObject, LearningObjectIdentifier, LearningPathIdentifier } from '../../interfaces/learning-content';

export interface LearningObjectProvider {
    /**
     * Fetches a single learning object by its HRUID
     */
    getLearningObjectById(id: LearningObjectIdentifier): Promise<FilteredLearningObject | null>;

    /**
     * Fetch full learning object data (metadata)
     */
    getLearningObjectsFromPath(id: LearningPathIdentifier): Promise<FilteredLearningObject[]>;

    /**
     * Fetch only learning object HRUIDs
     */
    getLearningObjectIdsFromPath(id: LearningPathIdentifier): Promise<string[]>;

    /**
     * Obtain a HTML-rendering of the learning object with the given identifier (as a string).
     */
    getLearningObjectHTML(id: LearningObjectIdentifier): Promise<string | null>;
}
