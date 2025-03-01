import { DWENGO_API_BASE } from '../config/config.js';
import { fetchWithLogging } from "../util/apiHelper.js";
import {FilteredLearningObject, LearningObjectMetadata, LearningObjectNode} from "../interfaces/learningPath.js";
import {fetchLearningPaths} from "./learningPaths.js";


function filterLearningObjectMetadata(data: LearningObjectMetadata, htmlUrl: string) : FilteredLearningObject {
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

export async function getLearningObjectsFromPath(
    hruid: string,
    language: string
):  Promise<FilteredLearningObject[]> {
    try {
        const learningPathResponse = await fetchLearningPaths([hruid], language, `Learning path for HRUID "${hruid}"`);

        if (!learningPathResponse.success || !learningPathResponse.data || learningPathResponse.data.length === 0) {
            console.error(`⚠️ WARNING: Learning path "${hruid}" exists but contains no learning objects.`);
            return [];
        }

        const nodes: LearningObjectNode[] = learningPathResponse.data[0].nodes;

        return await Promise.all(
            nodes.map(async (node) => {
                const metadataUrl = `${DWENGO_API_BASE}/learningObject/getMetadata?hruid=${node.learningobject_hruid}&version=${node.version}&language=${language}`;
                const metadata = await fetchWithLogging<LearningObjectMetadata>(
                    metadataUrl,
                    `Metadata for Learning Object HRUID "${node.learningobject_hruid}" (version ${node.version}, language ${language})`
                );

                if (!metadata) return null;

                const htmlUrl = `${DWENGO_API_BASE}/learningObject/getRaw?hruid=${node.learningobject_hruid}&version=${node.version}&language=${language}`;
                return filterLearningObjectMetadata(metadata, htmlUrl);
            })
        ).then((objects) => objects.filter((obj): obj is FilteredLearningObject => obj !== null));
    } catch (error) {
        console.error('Error fetching learning objects:', error);
        return [];
    }
}
