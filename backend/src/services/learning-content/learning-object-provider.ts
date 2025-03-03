import {FilteredLearningObject} from "../../interfaces/learningContent";

export interface LearningObjectProvider {
    /**
     * Fetches a single learning object by its HRUID
     */
    getLearningObjectById(hruid: string, language: string): Promise<FilteredLearningObject | null>;

    /**
     * Fetch full learning object data (metadata)
     */
    getLearningObjectsFromPath(hruid: string, language: string): Promise<FilteredLearningObject[]>;

    /**
     * Fetch only learning object HRUIDs
     */
    getLearningObjectIdsFromPath(hruid: string, language: string): Promise<string[]>;
}
