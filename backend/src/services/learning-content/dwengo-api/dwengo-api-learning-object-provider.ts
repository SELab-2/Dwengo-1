import { DWENGO_API_BASE } from '../../../config.js';
import { fetchWithLogging } from '../../../util/apiHelper.js';
import {
    FilteredLearningObject,
    LearningObjectMetadata,
    LearningObjectNode,
    LearningPathResponse,
} from '../../../interfaces/learningContent.js';
import dwengoApiLearningPathProvider from './dwengo-api-learning-path-provider.js';
import {LearningObjectProvider} from "../learning-object-provider";

/**
 * Helper function to convert the learning object metadata retrieved from the API to a FilteredLearningObject which
 * our API should return.
 * @param data
 * @param htmlUrl
 */
function filterData(
    data: LearningObjectMetadata,
    htmlUrl: string
): FilteredLearningObject {
    return {
        key: data.hruid, // Hruid learningObject (not path)
        _id: data._id,
        uuid: data.uuid,
        version: data.version,
        title: data.title,
        htmlUrl, // Url to fetch html content
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
 * Generic helper function to fetch learning objects (full data or just HRUIDs)
 */
async function fetchLearningObjects(
    hruid: string,
    full: boolean,
    language: string
): Promise<FilteredLearningObject[] | string[]> {
    try {
        const learningPathResponse: LearningPathResponse =
            await dwengoApiLearningPathProvider.fetchLearningPaths(
                [hruid],
                language,
                `Learning path for HRUID "${hruid}"`
            );

        if (
            !learningPathResponse.success ||
            !learningPathResponse.data?.length
        ) {
            console.error(
                `⚠️ WARNING: Learning path "${hruid}" exists but contains no learning objects.`
            );
            return [];
        }

        const nodes: LearningObjectNode[] = learningPathResponse.data[0].nodes;

        if (!full) {
            return nodes.map((node) => {
                return node.learningobject_hruid;
            });
        }

        return await Promise.all(
            nodes.map(async (node) => {
                return dwengoApiLearningObjectProvider.getLearningObjectById(
                    node.learningobject_hruid,
                    language
                );
            })
        ).then((objects) => {
            return objects.filter((obj): obj is FilteredLearningObject => {
                return obj !== null;
            });
        });
    } catch (error) {
        console.error('❌ Error fetching learning objects:', error);
        return [];
    }
}

const dwengoApiLearningObjectProvider: LearningObjectProvider = {
    /**
     * Fetches a single learning object by its HRUID
     */
    async getLearningObjectById(
        hruid: string,
        language: string
    ): Promise<FilteredLearningObject | null> {
        const metadataUrl = `${DWENGO_API_BASE}/learningObject/getMetadata?hruid=${hruid}&language=${language}`;
        const metadata = await fetchWithLogging<LearningObjectMetadata>(
            metadataUrl,
            `Metadata for Learning Object HRUID "${hruid}" (language ${language})`
        );

        if (!metadata) {
            console.error(`⚠️ WARNING: Learning object "${hruid}" not found.`);
            return null;
        }

        const htmlUrl = `${DWENGO_API_BASE}/learningObject/getRaw?hruid=${hruid}&language=${language}`;
        return filterData(metadata, htmlUrl);
    },

    /**
     * Fetch full learning object data (metadata)
     */
    async getLearningObjectsFromPath(
        hruid: string,
        language: string
    ): Promise<FilteredLearningObject[]> {
        return (await fetchLearningObjects(
            hruid,
            true,
            language
        )) as FilteredLearningObject[];
    },

    /**
     * Fetch only learning object HRUIDs
     */
    async getLearningObjectIdsFromPath(
        hruid: string,
        language: string
    ): Promise<string[]> {
        return (await fetchLearningObjects(hruid, false, language)) as string[];
    }
};

export default dwengoApiLearningObjectProvider;
