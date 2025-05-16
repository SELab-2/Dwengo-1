import { FilteredLearningObject, LearningObjectIdentifierDTO, LearningPathIdentifier } from '@dwengo-1/common/interfaces/learning-content';

export interface LearningObjectProvider {
    /**
     * Fetches a single learning object by its HRUID
     */
    getLearningObjectById(id: LearningObjectIdentifierDTO): Promise<FilteredLearningObject | null>;

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
    getLearningObjectHTML(id: LearningObjectIdentifierDTO): Promise<string | null>;

    /**
     * Obtain all learning object who have the user with the given username as an admin.
     */
    getLearningObjectsAdministratedBy(username: string): Promise<FilteredLearningObject[]>;
}
