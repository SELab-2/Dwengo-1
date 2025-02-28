import axios from "axios";
import { DWENGO_API_BASE } from "../config/config.js";

interface LearningObjectNode {
    _id: string;
    learningobject_hruid: string;
    version: number;
    language: string;
}


export async function getLearningObjectsFromPath(hruid: string, language: string) {
    try {
        const learningPathUrl = `${DWENGO_API_BASE}/learningPath/${hruid}/${language}`;
        const learningPathResponse = await axios.get(learningPathUrl);
        const nodes = learningPathResponse.data.nodes;

        if (!nodes || nodes.length === 0) {
            throw new Error("No learning objects found in this learning path.");
        }

        return await Promise.all(
            nodes.map(async (node: LearningObjectNode) => {
                const metadataUrl = `${DWENGO_API_BASE}/learningObject/getMetadata?hruid=${node.learningobject_hruid}&version=${node.version}&language=${language}`;
                const metadataResponse = await axios.get(metadataUrl);

                const html_url = `${DWENGO_API_BASE}/learningObject/getRaw?hruid=${node.learningobject_hruid}&version=${node.version}&language=${language}`;

                return filterLearningObjectMetadata(metadataResponse.data, html_url);
            })
        );

    } catch (error) {
        console.error("Error fetching learning objects:", error);
        throw new Error("Failed to fetch learning objects.");
    }
}

function filterLearningObjectMetadata(data: any, html_url: String) {
    return {
        key: data.hruid,
                // hruid learningObject (not path)
        _id: data._id,
        uuid: data.uuid,
        version: data.version,

        title: data.title,
        html_url,
            // html content object
        language: data.language,
        difficulty: data.difficulty,
        estimated_time: data.estimated_time,
        available: data.available,
        teacher_exclusive: data.teacher_exclusive,
        educational_goals: data.educational_goals,
                // list with learningObjects
        keywords: data.keywords,
                // for search
        description: data.description,
                // for search (not an actual description)
        target_ages: data.target_ages,

        // skos concepts needed ??
        // content type needed ??
        // content location ??
    };
}
