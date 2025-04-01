import { FilteredLearningObject, LearningObjectIdentifier, LearningPathIdentifier } from '../../interfaces/learning-content.js';
import dwengoApiLearningObjectProvider from './dwengo-api-learning-object-provider.js';
import { LearningObjectProvider } from './learning-object-provider.js';
import { envVars, getEnvVar } from '../../util/envVars.js';
import databaseLearningObjectProvider from './database-learning-object-provider.js';

function getProvider(id: LearningObjectIdentifier): LearningObjectProvider {
    if (id.hruid.startsWith(getEnvVar(envVars.UserContentPrefix))) {
        return databaseLearningObjectProvider;
    }
    return dwengoApiLearningObjectProvider;
}

/**
 * Service providing access to data about learning objects from the appropriate data source (database or Dwengo-api)
 */
const learningObjectService = {
    /**
     * Fetches a single learning object by its HRUID
     */
    async getLearningObjectById(id: LearningObjectIdentifier): Promise<FilteredLearningObject | null> {
        return getProvider(id).getLearningObjectById(id);
    },

    /**
     * Fetch full learning object data (metadata)
     */
    async getLearningObjectsFromPath(id: LearningPathIdentifier): Promise<FilteredLearningObject[]> {
        return getProvider(id).getLearningObjectsFromPath(id);
    },

    /**
     * Fetch only learning object HRUIDs
     */
    async getLearningObjectIdsFromPath(id: LearningPathIdentifier): Promise<string[]> {
        return getProvider(id).getLearningObjectIdsFromPath(id);
    },

    /**
     * Obtain a HTML-rendering of the learning object with the given identifier (as a string).
     */
    async getLearningObjectHTML(id: LearningObjectIdentifier): Promise<string | null> {
        return getProvider(id).getLearningObjectHTML(id);
    },
};

export default learningObjectService;
