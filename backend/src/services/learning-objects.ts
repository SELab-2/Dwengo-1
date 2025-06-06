import { DWENGO_API_BASE } from '../config.js';
import { fetchRemote } from '../util/api-helper.js';

import {
    FilteredLearningObject,
    LearningObjectMetadata,
    LearningObjectNode,
    LearningPathResponse,
} from '@dwengo-1/common/interfaces/learning-content';
import { getLogger } from '../logging/initalize.js';
import { v4 } from 'uuid';

function filterData(data: LearningObjectMetadata, htmlUrl: string): FilteredLearningObject {
    return {
        key: data.hruid, // Hruid learningObject (not path)
        _id: data._id,
        uuid: data.uuid || v4(),
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
 * Fetches a single learning object by its HRUID
 */
export async function getLearningObjectById(hruid: string, language: string): Promise<FilteredLearningObject | null> {
    const metadataUrl = `${DWENGO_API_BASE}/learningObject/getMetadata?hruid=${hruid}&language=${language}`;
    const metadata = await fetchRemote<LearningObjectMetadata>(metadataUrl, `Metadata for Learning Object HRUID "${hruid}" (language ${language})`);

    if (!metadata) {
        getLogger().error(`⚠️ WARNING: Learning object "${hruid}" not found.`);
        return null;
    }

    const htmlUrl = `${DWENGO_API_BASE}/learningObject/getRaw?hruid=${hruid}&language=${language}`;
    return filterData(metadata, htmlUrl);
}

/**
 * Generic function to fetch learning paths
 */
function fetchLearningPaths(_arg0: string[], _language: string, _arg2: string): LearningPathResponse | PromiseLike<LearningPathResponse> {
    throw new Error('Function not implemented.');
}

/**
 * Generic function to fetch learning objects (full data or just HRUIDs)
 */
async function fetchLearningObjects(hruid: string, full: boolean, language: string): Promise<FilteredLearningObject[] | string[]> {
    try {
        const learningPathResponse: LearningPathResponse = await fetchLearningPaths([hruid], language, `Learning path for HRUID "${hruid}"`);

        if (!learningPathResponse.success || !learningPathResponse.data?.length) {
            getLogger().error(`⚠️ WARNING: Learning path "${hruid}" exists but contains no learning objects.`);
            return [];
        }

        const nodes: LearningObjectNode[] = learningPathResponse.data[0].nodes;

        if (!full) {
            return nodes.map((node) => node.learningobject_hruid);
        }

        return await Promise.all(nodes.map(async (node) => getLearningObjectById(node.learningobject_hruid, language))).then((objects) =>
            objects.filter((obj): obj is FilteredLearningObject => obj !== null)
        );
    } catch (error) {
        getLogger().error('❌ Error fetching learning objects:', error);
        return [];
    }
}

/**
 * Fetch full learning object data (metadata)
 */
export async function getLearningObjectsFromPath(hruid: string, language: string): Promise<FilteredLearningObject[]> {
    return (await fetchLearningObjects(hruid, true, language)) as FilteredLearningObject[];
}

/**
 * Fetch only learning object HRUIDs
 */
export async function getLearningObjectIdsFromPath(hruid: string, language: string): Promise<string[]> {
    return (await fetchLearningObjects(hruid, false, language)) as string[];
}
