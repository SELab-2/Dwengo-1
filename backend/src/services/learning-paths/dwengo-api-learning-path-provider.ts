import { fetchWithLogging } from '../../util/api-helper.js';
import { DWENGO_API_BASE } from '../../config.js';
import { LearningPathProvider } from './learning-path-provider.js';
import { getLogger, Logger } from '../../logging/initalize.js';
import { LearningPath, LearningPathResponse } from '@dwengo-1/common/interfaces/learning-content';
import { Group } from '../../entities/assignments/group.entity.js';
import { getLastSubmissionForGroup, idFromLearningObjectNode } from './learning-path-personalization-util.js';

const logger: Logger = getLogger();

/**
 * Adds progress information to the learning path. Modifies the learning path in-place.
 * @param learningPath The learning path to add progress to.
 * @param personalizedFor The group whose progress should be shown.
 * @returns the modified learning path.
 */
async function addProgressToLearningPath(learningPath: LearningPath, personalizedFor: Group): Promise<LearningPath> {
    await Promise.all(
        learningPath.nodes.map(async (node) => {
            const lastSubmission = personalizedFor ? await getLastSubmissionForGroup(idFromLearningObjectNode(node), personalizedFor) : null;
            node.done = Boolean(lastSubmission);
        })
    );

    learningPath.num_nodes = learningPath.nodes.length;
    learningPath.num_nodes_left = learningPath.nodes.filter((it) => !it.done).length;

    return learningPath;
}

const dwengoApiLearningPathProvider: LearningPathProvider = {
    async fetchLearningPaths(hruids: string[], language: string, source: string, personalizedFor: Group): Promise<LearningPathResponse> {
        if (hruids.length === 0) {
            return {
                success: false,
                source,
                data: null,
                message: `No HRUIDs provided for ${source}.`,
            };
        }

        const apiUrl = `${DWENGO_API_BASE}/learningPath/getPathsFromIdList`;
        const params = { pathIdList: JSON.stringify({ hruids }), language };

        const learningPaths = await fetchWithLogging<LearningPath[]>(apiUrl, `Learning paths for ${source}`, { params });

        if (!learningPaths || learningPaths.length === 0) {
            logger.warn(`⚠️ WARNING: No learning paths found for ${source}.`);
            return {
                success: false,
                source,
                data: [],
                message: `No learning paths found for ${source}.`,
            };
        }

        await Promise.all(learningPaths?.map(async (it) => addProgressToLearningPath(it, personalizedFor)));

        return {
            success: true,
            source,
            data: learningPaths,
        };
    },
    async searchLearningPaths(query: string, language: string, personalizedFor: Group): Promise<LearningPath[]> {
        const apiUrl = `${DWENGO_API_BASE}/learningPath/search`;
        const params = { all: query, language };

        const searchResults = await fetchWithLogging<LearningPath[]>(apiUrl, `Search learning paths with query "${query}"`, { params });

        if (searchResults) {
            await Promise.all(searchResults?.map(async (it) => addProgressToLearningPath(it, personalizedFor)));
        }

        return searchResults ?? [];
    },
};

export default dwengoApiLearningPathProvider;
