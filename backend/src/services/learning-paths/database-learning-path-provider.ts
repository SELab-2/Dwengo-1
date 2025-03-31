import { LearningPathProvider } from './learning-path-provider.js';
import { LearningPath as LearningPathEntity } from '../../entities/content/learning-path.entity.js';
import { getLearningPathRepository } from '../../data/repositories.js';
import learningObjectService from '../learning-objects/learning-object-service.js';
import { LearningPathNode } from '../../entities/content/learning-path-node.entity.js';
import { LearningPathTransition } from '../../entities/content/learning-path-transition.entity.js';
import { getLastSubmissionForCustomizationTarget, isTransitionPossible, PersonalizationTarget } from './learning-path-personalization-util.js';
import {
    FilteredLearningObject,
    LearningObjectNode,
    LearningPath,
    LearningPathResponse,
    Transition,
} from 'dwengo-1-common/src/interfaces/learning-content';
import { Language } from 'dwengo-1-common/src/util/language.js';

/**
 * Fetches the corresponding learning object for each of the nodes and creates a map that maps each node to its
 * corresponding learning object.
 * @param nodes The nodes to find the learning object for.
 */
async function getLearningObjectsForNodes(nodes: LearningPathNode[]): Promise<Map<LearningPathNode, FilteredLearningObject>> {
    // Fetching the corresponding learning object for each of the nodes and creating a map that maps each node to
    // Its corresponding learning object.
    const nullableNodesToLearningObjects = new Map<LearningPathNode, FilteredLearningObject | null>(
        await Promise.all(
            nodes.map((node) =>
                learningObjectService
                    .getLearningObjectById({
                        hruid: node.learningObjectHruid,
                        version: node.version,
                        language: node.language,
                    })
                    .then((learningObject) => <[LearningPathNode, FilteredLearningObject | null]>[node, learningObject])
            )
        )
    );
    if (Array.from(nullableNodesToLearningObjects.values()).some((it) => it === null)) {
        throw new Error('At least one of the learning objects on this path could not be found.');
    }
    return nullableNodesToLearningObjects as Map<LearningPathNode, FilteredLearningObject>;
}

/**
 * Convert the given learning path entity to an object which conforms to the learning path content.
 */
async function convertLearningPath(learningPath: LearningPathEntity, order: number, personalizedFor?: PersonalizationTarget): Promise<LearningPath> {
    // Fetch the corresponding learning object for each node since some parts of the expected response contains parts
    // With information which is not available in the LearningPathNodes themselves.
    const nodesToLearningObjects: Map<LearningPathNode, FilteredLearningObject> = await getLearningObjectsForNodes(learningPath.nodes);

    // The target ages of a learning path are the union of the target ages of all learning objects.
    const targetAges = [...new Set(Array.from(nodesToLearningObjects.values()).flatMap((it) => it.targetAges || []))];
    // The keywords of the learning path consist of the union of the keywords of all learning objects.
    const keywords = [...new Set(Array.from(nodesToLearningObjects.values()).flatMap((it) => it.keywords || []))];

    const image = learningPath.image ? learningPath.image.toString('base64') : undefined;

    // Convert the learning object notes as retrieved from the database into the expected response format-
    const convertedNodes = await convertNodes(nodesToLearningObjects, personalizedFor);

    return {
        _id: `${learningPath.hruid}/${learningPath.language}`, // For backwards compatibility with the original Dwengo API.
        __order: order,
        hruid: learningPath.hruid,
        language: learningPath.language,
        description: learningPath.description,
        image: image,
        title: learningPath.title,
        nodes: convertedNodes,
        num_nodes: learningPath.nodes.length,
        num_nodes_left: convertedNodes.filter((it) => !it.done).length,
        keywords: keywords.join(' '),
        target_ages: targetAges,
        max_age: Math.max(...targetAges),
        min_age: Math.min(...targetAges),
    };
}

/**
 * Helper function converting a single learning path node (as represented in the database) and the corresponding
 * learning object into a learning path node as it should be represented in the API.
 *
 * @param node Learning path node as represented in the database.
 * @param learningObject Learning object the learning path node refers to.
 * @param personalizedFor Personalization target if a personalized learning path is desired.
 * @param nodesToLearningObjects Mapping from learning path nodes to the corresponding learning objects.
 */
async function convertNode(
    node: LearningPathNode,
    learningObject: FilteredLearningObject,
    personalizedFor: PersonalizationTarget | undefined,
    nodesToLearningObjects: Map<LearningPathNode, FilteredLearningObject>
): Promise<LearningObjectNode> {
    const lastSubmission = personalizedFor ? await getLastSubmissionForCustomizationTarget(node, personalizedFor) : null;
    const transitions = node.transitions
        .filter(
            (trans) =>
                !personalizedFor || // If we do not want a personalized learning path, keep all transitions
                isTransitionPossible(trans, optionalJsonStringToObject(lastSubmission?.content)) // Otherwise remove all transitions that aren't possible.
        )
        .map((trans, i) => convertTransition(trans, i, nodesToLearningObjects));
    return {
        _id: learningObject.uuid,
        language: learningObject.language,
        start_node: node.startNode,
        created_at: node.createdAt.toISOString(),
        updatedAt: node.updatedAt.toISOString(),
        learningobject_hruid: node.learningObjectHruid,
        version: learningObject.version,
        transitions,
    };
}

/**
 * Helper function converting pairs of learning path nodes (as represented in the database) and the corresponding
 * learning objects into a list of learning path nodes as they should be represented in the API.
 *
 * @param nodesToLearningObjects Mapping from learning path nodes to the corresponding learning objects.
 * @param personalizedFor Personalization target if a personalized learning path is desired.
 */
async function convertNodes(
    nodesToLearningObjects: Map<LearningPathNode, FilteredLearningObject>,
    personalizedFor?: PersonalizationTarget
): Promise<LearningObjectNode[]> {
    const nodesPromise = Array.from(nodesToLearningObjects.entries()).map((entry) =>
        convertNode(entry[0], entry[1], personalizedFor, nodesToLearningObjects)
    );
    return await Promise.all(nodesPromise);
}

/**
 * Helper method to convert a json string to an object, or null if it is undefined.
 */
function optionalJsonStringToObject(jsonString?: string): object | null {
    if (!jsonString) {
        return null;
    }
    return JSON.parse(jsonString);
}

/**
 * Helper function which converts a transition in the database representation to a transition in the representation
 * the Dwengo API uses.
 *
 * @param transition The transition to convert
 * @param index The sequence number of the transition to convert
 * @param nodesToLearningObjects Map which maps each learning path node of the current learning path to the learning
 *                               object it refers to.
 */
function convertTransition(
    transition: LearningPathTransition,
    index: number,
    nodesToLearningObjects: Map<LearningPathNode, FilteredLearningObject>
): Transition {
    const nextNode = nodesToLearningObjects.get(transition.next);
    if (!nextNode) {
        throw new Error(`Learning object ${transition.next.learningObjectHruid}/${transition.next.language}/${transition.next.version} not found!`);
    } else {
        return {
            _id: '' + index, // Retained for backwards compatibility. The index uniquely identifies the transition within the learning path.
            default: false, // We don't work with default transitions but retain this for backwards compatibility.
            next: {
                _id: nextNode._id + index, // Construct a unique ID for the transition for backwards compatibility.
                hruid: transition.next.learningObjectHruid,
                language: nextNode.language,
                version: nextNode.version,
            },
        };
    }
}

/**
 * Service providing access to data about learning paths from the database.
 */
const databaseLearningPathProvider: LearningPathProvider = {
    /**
     * Fetch the learning paths with the given hruids from the database.
     */
    async fetchLearningPaths(
        hruids: string[],
        language: Language,
        source: string,
        personalizedFor?: PersonalizationTarget
    ): Promise<LearningPathResponse> {
        const learningPathRepo = getLearningPathRepository();

        const learningPaths = (await Promise.all(hruids.map((hruid) => learningPathRepo.findByHruidAndLanguage(hruid, language)))).filter(
            (learningPath) => learningPath !== null
        );
        const filteredLearningPaths = await Promise.all(
            learningPaths.map((learningPath, index) => convertLearningPath(learningPath, index, personalizedFor))
        );

        return {
            success: filteredLearningPaths.length > 0,
            data: await Promise.all(filteredLearningPaths),
            source,
        };
    },

    /**
     * Search learning paths in the database using the given search string.
     */
    async searchLearningPaths(query: string, language: Language, personalizedFor?: PersonalizationTarget): Promise<LearningPath[]> {
        const learningPathRepo = getLearningPathRepository();

        const searchResults = await learningPathRepo.findByQueryStringAndLanguage(query, language);
        return await Promise.all(searchResults.map((result, index) => convertLearningPath(result, index, personalizedFor)));
    },
};

export default databaseLearningPathProvider;
