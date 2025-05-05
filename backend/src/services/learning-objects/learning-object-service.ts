import dwengoApiLearningObjectProvider from './dwengo-api-learning-object-provider.js';
import { LearningObjectProvider } from './learning-object-provider.js';
import { envVars, getEnvVar } from '../../util/envVars.js';
import databaseLearningObjectProvider from './database-learning-object-provider.js';
import {
    FilteredLearningObject,
    LearningObjectIdentifierDTO,
    LearningPathIdentifier
} from '@dwengo-1/common/interfaces/learning-content';
import {getLearningObjectRepository} from "../../data/repositories";
import {processLearningObjectZip} from "./learning-object-zip-processing-service";
import {BadRequestException} from "../../exceptions/bad-request-exception";

function getProvider(id: LearningObjectIdentifierDTO): LearningObjectProvider {
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
    async getLearningObjectById(id: LearningObjectIdentifierDTO): Promise<FilteredLearningObject | null> {
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
    async getLearningObjectHTML(id: LearningObjectIdentifierDTO): Promise<string | null> {
        return getProvider(id).getLearningObjectHTML(id);
    },


    /**
     * Store the learning object in the given zip file in the database.
     */
    async storeLearningObject(learningObjectPath: string): Promise<void> {
        const learningObjectRepository = getLearningObjectRepository();
        const learningObject = await processLearningObjectZip(learningObjectPath);

        if (!learningObject.hruid.startsWith(getEnvVar(envVars.UserContentPrefix))) {
            throw new BadRequestException("Learning object name must start with the user content prefix!");
        }

        await learningObjectRepository.save(learningObject, {preventOverwrite: true});
    }
};

export default learningObjectService;
