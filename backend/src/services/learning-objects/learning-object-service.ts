import dwengoApiLearningObjectProvider from './dwengo-api-learning-object-provider.js';
import { LearningObjectProvider } from './learning-object-provider.js';
import { envVars, getEnvVar } from '../../util/envVars.js';
import databaseLearningObjectProvider from './database-learning-object-provider.js';
import { FilteredLearningObject, LearningObjectIdentifierDTO, LearningPathIdentifier } from '@dwengo-1/common/interfaces/learning-content';
import { getLearningObjectRepository, getTeacherRepository } from '../../data/repositories.js';
import { processLearningObjectZip } from './learning-object-zip-processing-service.js';
import { LearningObject } from '../../entities/content/learning-object.entity.js';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier.js';
import { NotFoundException } from '../../exceptions/not-found-exception.js';

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
     * Obtain all learning objects administrated by the user with the given username.
     */
    async getLearningObjectsAdministratedBy(adminUsername: string): Promise<FilteredLearningObject[]> {
        return databaseLearningObjectProvider.getLearningObjectsAdministratedBy(adminUsername);
    },

    /**
     * Store the learning object in the given zip file in the database.
     * @param learningObjectPath The path where the uploaded learning object resides.
     * @param admins The usernames of the users which should be administrators of the learning object.
     */
    async storeLearningObject(learningObjectPath: string, admins: string[]): Promise<LearningObject> {
        const learningObjectRepository = getLearningObjectRepository();
        const learningObject = await processLearningObjectZip(learningObjectPath);

        if (!learningObject.hruid.startsWith(getEnvVar(envVars.UserContentPrefix))) {
            learningObject.hruid = getEnvVar(envVars.UserContentPrefix) + learningObject.hruid;
        }

        // Lookup the admin teachers based on their usernames and add them to the admins of the learning object.
        const teacherRepo = getTeacherRepository();
        const adminTeachers = await Promise.all(admins.map(async (it) => teacherRepo.findByUsername(it)));
        adminTeachers.forEach((it) => {
            if (it !== null) {
                learningObject.admins.add(it);
            }
        });

        try {
            await learningObjectRepository.save(learningObject, { preventOverwrite: true });
        } catch (e: unknown) {
            learningObjectRepository.getEntityManager().clear();
            throw e;
        }

        return learningObject;
    },

    /**
     * Deletes the learning object with the given identifier.
     */
    async deleteLearningObject(id: LearningObjectIdentifier): Promise<LearningObject | null> {
        const learningObjectRepository = getLearningObjectRepository();
        return await learningObjectRepository.removeByIdentifier(id);
    },

    /**
     * Returns a list of the usernames of the administrators of the learning object with the given identifier.
     * @throws NotFoundException if the specified learning object was not found in the database.
     */
    async getAdmins(id: LearningObjectIdentifier): Promise<string[]> {
        const learningObjectRepo = getLearningObjectRepository();
        const learningObject = await learningObjectRepo.findByIdentifier(id);
        if (!learningObject) {
            throw new NotFoundException('learningObjectNotFound');
        }
        return learningObject.admins.map((admin) => admin.username);
    },
};

export default learningObjectService;
