import { LearningPath, LearningPathResponse } from '@dwengo-1/common/interfaces/learning-content';
import { Language } from '@dwengo-1/common/util/language';
import { Group } from '../../entities/assignments/group.entity';

/**
 * Generic interface for a service which provides access to learning paths from a data source.
 */
export interface LearningPathProvider {
    /**
     * Fetch the learning paths with the given hruids from the data source.
     */
    fetchLearningPaths(hruids: string[], language: Language, source: string, personalizedFor?: Group): Promise<LearningPathResponse>;

    /**
     * Search learning paths in the data source using the given search string.
     */
    searchLearningPaths(query: string, language: Language, personalizedFor?: Group): Promise<LearningPath[]>;

    /**
     * Get all learning paths which have the teacher with the given user as an administrator.
     */
    getLearningPathsAdministratedBy(adminUsername: string): Promise<LearningPath[]>;
}
