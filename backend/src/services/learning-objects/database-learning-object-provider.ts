import { LearningObjectProvider } from './learning-object-provider';
import { FilteredLearningObject, LearningObjectIdentifier, LearningPathIdentifier } from '../../interfaces/learning-content';
import { getLearningObjectRepository, getLearningPathRepository } from '../../data/repositories';
import { Language } from '../../entities/content/language';
import { LearningObject } from '../../entities/content/learning-object.entity';
import { getUrlStringForLearningObject } from '../../util/links';
import processingService from './processing/processing-service';
import { NotFoundError } from '@mikro-orm/core';

function convertLearningObject(learningObject: LearningObject | null): FilteredLearningObject | null {
    if (!learningObject) {
        return null;
    }
    return {
        key: learningObject.hruid,
        _id: learningObject.uuid, // For backwards compatibility with the original Dwengo API, we also populate the _id field.
        uuid: learningObject.uuid,
        language: learningObject.language,
        version: learningObject.version,
        title: learningObject.title,
        description: learningObject.description,
        htmlUrl: getUrlStringForLearningObject(learningObject),
        available: learningObject.available,
        contentType: learningObject.contentType,
        contentLocation: learningObject.contentLocation,
        difficulty: learningObject.difficulty || 1,
        estimatedTime: learningObject.estimatedTime,
        keywords: learningObject.keywords,
        educationalGoals: learningObject.educationalGoals,
        returnValue: {
            callback_url: learningObject.returnValue.callbackUrl,
            callback_schema: JSON.parse(learningObject.returnValue.callbackSchema),
        },
        skosConcepts: learningObject.skosConcepts,
        targetAges: learningObject.targetAges || [],
        teacherExclusive: learningObject.teacherExclusive,
    };
}

function findLearningObjectEntityById(id: LearningObjectIdentifier): Promise<LearningObject | null> {
    const learningObjectRepo = getLearningObjectRepository();

    return learningObjectRepo.findLatestByHruidAndLanguage(id.hruid, id.language as Language);
}

/**
 * Service providing access to data about learning objects from the database
 */
const databaseLearningObjectProvider: LearningObjectProvider = {
    /**
     * Fetches a single learning object by its HRUID
     */
    async getLearningObjectById(id: LearningObjectIdentifier): Promise<FilteredLearningObject | null> {
        const learningObject = await findLearningObjectEntityById(id);
        return convertLearningObject(learningObject);
    },

    /**
     * Obtain a HTML-rendering of the learning object with the given identifier (as a string).
     */
    async getLearningObjectHTML(id: LearningObjectIdentifier): Promise<string | null> {
        const learningObjectRepo = getLearningObjectRepository();

        const learningObject = await learningObjectRepo.findLatestByHruidAndLanguage(id.hruid, id.language as Language);
        if (!learningObject) {
            return null;
        }
        return await processingService.render(learningObject, (id) => findLearningObjectEntityById(id));
    },

    /**
     * Fetch the HRUIDs of all learning objects on this path.
     */
    async getLearningObjectIdsFromPath(id: LearningPathIdentifier): Promise<string[]> {
        const learningPathRepo = getLearningPathRepository();

        const learningPath = await learningPathRepo.findByHruidAndLanguage(id.hruid, id.language);
        if (!learningPath) {
            throw new NotFoundError('The learning path with the given ID could not be found.');
        }
        return learningPath.nodes.map((it) => it.learningObjectHruid); // TODO: Determine this based on the submissions of the user.
    },

    /**
     * Fetch the full metadata of all learning objects on this path.
     */
    async getLearningObjectsFromPath(id: LearningPathIdentifier): Promise<FilteredLearningObject[]> {
        const learningPathRepo = getLearningPathRepository();

        const learningPath = await learningPathRepo.findByHruidAndLanguage(id.hruid, id.language);
        if (!learningPath) {
            throw new NotFoundError('The learning path with the given ID could not be found.');
        }
        const learningObjects = await Promise.all(
            learningPath.nodes.map((it) => {
                const learningObject = this.getLearningObjectById({
                    hruid: it.learningObjectHruid,
                    language: it.language,
                    version: it.version,
                });
                if (learningObject === null) {
                    console.log(`WARN: Learning object corresponding with node ${it} not found!`);
                }
                return learningObject;
            })
        );
        return learningObjects.filter((it) => it !== null); // TODO: Determine this based on the submissions of the user.
    },
};

export default databaseLearningObjectProvider;
