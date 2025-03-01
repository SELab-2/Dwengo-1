import axios from 'axios';
import { DWENGO_API_BASE } from '../config/config.js';
import { fetchWithLogging } from "../util/apiHelper.js";

interface LearningObjectNode {
    _id: string;
    learningobject_hruid: string;
    version: number;
    language: string;
}

function filterLearningObjectMetadata(data: any, htmlUrl: string) {
    return {
        key: data.hruid,
        // Hruid learningObject (not path)
        _id: data._id,
        uuid: data.uuid,
        version: data.version,

        title: data.title,
        htmlUrl,
        // Url to fetch html content
        language: data.language,
        difficulty: data.difficulty,
        estimatedTime: data.estimated_time,
        available: data.available,
        teacherExclusive: data.teacher_exclusive,
        educationalGoals: data.educational_goals,
        // List with learningObjects
        keywords: data.keywords,
        // For search
        description: data.description,
        // For search (not an actual description)
        targetAges: data.target_ages,
        contentType: data.content_type,
        // Text/plain, text/md, image/image-block,
        // Image/image/, audio/mpeg or extern
        contentLocation: data.content_location,
        // If content type extern

        // Skos concepts needed ??
        // Return value needed ??
        // Callback_url to send response
        // Callback_scheme
    };
}

export async function getLearningObjectsFromPath(
    hruid: string,
    language: string
) {
    try {
        const learningPathUrl = `${DWENGO_API_BASE}/learningPath/${hruid}/${language}`;
        const learningPathData = await fetchWithLogging<{ nodes: LearningObjectNode[] }>(
            learningPathUrl,
            `Learning path for HRUID "${hruid}" in language "${language}"`
        );

        if (!learningPathData || !learningPathData.nodes || learningPathData.nodes.length === 0) {
            console.error(`⚠️ WARNING: Learning path "${hruid}" exists but contains no learning objects.`);
            return [];
        }

        return await Promise.all(
            learningPathData.nodes.map(async (node: LearningObjectNode) => {
                const metadataUrl = `${DWENGO_API_BASE}/learningObject/getMetadata?hruid=${node.learningobject_hruid}&version=${node.version}&language=${language}`;
                const metadata = await fetchWithLogging(
                    metadataUrl,
                    `Metadata for Learning Object HRUID "${node.learningobject_hruid}" (version ${node.version}, language ${language})`
                );

                if (!metadata) return null;

                const htmlUrl = `${DWENGO_API_BASE}/learningObject/getRaw?hruid=${node.learningobject_hruid}&version=${node.version}&language=${language}`;
                return filterLearningObjectMetadata(metadata, htmlUrl);
            })
        );
    } catch (error) {
        console.error('Error fetching learning objects:', error);
    }
}
