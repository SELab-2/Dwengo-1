import { DWENGO_API_BASE } from '../../config.js';
import { fetchRemote } from '../../util/api-helper.js';
import dwengoApiLearningPathProvider from '../learning-paths/dwengo-api-learning-path-provider.js';
import { LearningObjectProvider } from './learning-object-provider.js';
import { getLogger, Logger } from '../../logging/initalize.js';
import {
    FilteredLearningObject,
    LearningObjectIdentifierDTO,
    LearningObjectMetadata,
    LearningObjectNode,
    LearningPathIdentifier,
    LearningPathResponse,
} from '@dwengo-1/common/interfaces/learning-content';
import { v4 } from 'uuid';

const logger: Logger = getLogger();

/**
 * Helper function to convert the learning object metadata retrieved from the API to a FilteredLearningObject which
 * our API should return.
 * @param data
 */
function filterData(data: LearningObjectMetadata): FilteredLearningObject {
    return {
        key: data.hruid, // Hruid learningObject (not path)
        _id: data._id,
        uuid: data.uuid ?? v4(),
        version: data.version,
        title: data.title,
        htmlUrl: `/learningObject/${data.hruid}/html?language=${data.language}&version=${data.version}`, // Url to fetch html content
        language: data.language,
        difficulty: data.difficulty,
        estimatedTime: data.estimated_time,
        available: data.available,
        teacherExclusive: data.teacher_exclusive,
        educationalGoals: data.educational_goals, // List with learningObjects
        keywords: data.keywords, // For search
        description: data.description, // For search (not an actual description)
        targetAges: data.target_ages,
        contentType: data.content_type, // Markdown, image, audio, etc.
        contentLocation: data.content_location, // If content type extern
        skosConcepts: data.skos_concepts,
        returnValue: data.return_value, // Callback response information
    };
}

/**
 * Generic helper function to fetch all learning objects from a given path (full data or just HRUIDs)
 */
async function fetchLearningObjects(learningPathId: LearningPathIdentifier, full: boolean): Promise<FilteredLearningObject[] | string[]> {
    try {
        const learningPathResponse: LearningPathResponse = await dwengoApiLearningPathProvider.fetchLearningPaths(
            [learningPathId.hruid],
            learningPathId.language,
            `Learning path for HRUID "${learningPathId.hruid}"`
        );

        if (!learningPathResponse.success || !learningPathResponse.data?.length) {
            logger.warn(`⚠️ WARNING: Learning path "${learningPathId.hruid}" exists but contains no learning objects.`);
            return [];
        }

        const nodes: LearningObjectNode[] = learningPathResponse.data[0].nodes;

        if (!full) {
            return nodes.map((node) => node.learningobject_hruid);
        }

        const objects = await Promise.all(
            nodes.map(async (node) => {
                const learningObjectId: LearningObjectIdentifierDTO = {
                    hruid: node.learningobject_hruid,
                    language: learningPathId.language,
                };
                return dwengoApiLearningObjectProvider.getLearningObjectById(learningObjectId);
            })
        );
        return objects.filter((obj): obj is FilteredLearningObject => obj !== null);
    } catch (error) {
        logger.error('❌ Error fetching learning objects:', error);
        return [];
    }
}

const dwengoApiLearningObjectProvider: LearningObjectProvider = {
    /**
     * Fetches a single learning object by its HRUID
     */
    async getLearningObjectById(id: LearningObjectIdentifierDTO): Promise<FilteredLearningObject | null> {
        const metadataUrl = `${DWENGO_API_BASE}/learningObject/getMetadata`;
        const metadata = await fetchRemote<LearningObjectMetadata>(
            metadataUrl,
            `Metadata for Learning Object HRUID "${id.hruid}" (language ${id.language})`,
            {
                params: { ...id },
            }
        );

        if (!metadata || typeof metadata !== 'object') {
            logger.warn(`⚠️ WARNING: Learning object "${id.hruid}" not found.`);
            return null;
        }

        return filterData(metadata);
    },

    /**
     * Fetch full learning object data (metadata)
     */
    async getLearningObjectsFromPath(id: LearningPathIdentifier): Promise<FilteredLearningObject[]> {
        return (await fetchLearningObjects(id, true)) as FilteredLearningObject[];
    },

    /**
     * Fetch only learning object HRUIDs
     */
    async getLearningObjectIdsFromPath(id: LearningPathIdentifier): Promise<string[]> {
        return (await fetchLearningObjects(id, false)) as string[];
    },

    /**
     * Obtain a HTML-rendering of the learning object with the given identifier (as a string). For learning objects
     * from the Dwengo API, this means passing through the HTML rendering from there.
     */
    async getLearningObjectHTML(id: LearningObjectIdentifierDTO): Promise<string | null> {
        const htmlUrl = `${DWENGO_API_BASE}/learningObject/getRaw`;
        const html = await fetchRemote<string>(htmlUrl, `Metadata for Learning Object HRUID "${id.hruid}" (language ${id.language})`, {
            params: { ...id },
        });

        if (!html) {
            logger.warn(`⚠️ WARNING: Learning object "${id.hruid}" not found.`);
            return null;
        }

        return html;
    },
};

export default dwengoApiLearningObjectProvider;
