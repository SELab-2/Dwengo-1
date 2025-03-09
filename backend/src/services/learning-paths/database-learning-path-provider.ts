import {LearningPathProvider} from "./learning-path-provider";
import {
    FilteredLearningObject,
    LearningObjectNode,
    LearningPath,
    LearningPathResponse,
    Transition
} from "../../interfaces/learning-content";
import {
    LearningPath as LearningPathEntity,
    LearningPathNode,
    LearningPathTransition
} from "../../entities/content/learning-path.entity"
import {getLearningPathRepository} from "../../data/repositories";
import {Language} from "../../entities/content/language";
import learningObjectService from "../learning-objects/learning-object-service";

/**
 * Fetches the corresponding learning object for each of the nodes and creates a map that maps each node to its
 * corresponding learning object.
 * @param nodes The nodes to find the learning object for.
 */
async function getLearningObjectsForNodes(nodes: LearningPathNode[]): Promise<Map<LearningPathNode, FilteredLearningObject>> {
    // Fetching the corresponding learning object for each of the nodes and creating a map that maps each node to
    // its corresponding learning object.
    const nullableNodesToLearningObjects = new Map<LearningPathNode, FilteredLearningObject | null>(
        await Promise.all(
            nodes.map(node =>
                learningObjectService.getLearningObjectById({
                    hruid: node.learningObjectHruid,
                    version: node.version,
                    language: node.language
                }).then(learningObject =>
                    <[LearningPathNode, FilteredLearningObject | null]>[node, learningObject]
                )
            )
        )
    );
    if (nullableNodesToLearningObjects.values().some(it => it === null)) {
        throw new Error("At least one of the learning objects on this path could not be found.")
    }
    return nullableNodesToLearningObjects as Map<LearningPathNode, FilteredLearningObject>;
}

/**
 * Convert the given learning path entity to an object which conforms to the learning path content.
 */
async function convertLearningPath(learningPath: LearningPathEntity, order: number): Promise<LearningPath> {
    const nodesToLearningObjects: Map<LearningPathNode, FilteredLearningObject> =
        await getLearningObjectsForNodes(learningPath.nodes);

    const targetAges =
        nodesToLearningObjects.values().flatMap(it => it.targetAges || []).toArray();

    const keywords =
        nodesToLearningObjects.values().flatMap(it => it.keywords || []).toArray();

    return {
        _id: `${learningPath.hruid}/${learningPath.language}`, // for backwards compatibility with the original Dwengo API.
        __order: order,
        hruid: learningPath.hruid,
        language: learningPath.language,
        description: learningPath.description,
        image: learningPath.image,
        title: learningPath.title,
        nodes: convertNodes(nodesToLearningObjects),
        num_nodes: learningPath.nodes.length,
        num_nodes_left: learningPath.nodes.length, // TODO: Adjust when submissions are added.
        keywords: keywords.join(' '),
        target_ages: targetAges,
        max_age: Math.max(...targetAges),
        min_age: Math.min(...targetAges)
    }
}

/**
 * Helper function converting pairs of learning path nodes (as represented in the database) and the corresponding
 * learning objects into a list of learning path nodes as they should be represented in the API.
 * @param nodesToLearningObjects
 */
function convertNodes(
    nodesToLearningObjects: Map<LearningPathNode, FilteredLearningObject>
): LearningObjectNode[]  {
    return nodesToLearningObjects.entries().map((entry) => {
        const [node, learningObject] = entry;
        return {
            _id: learningObject.uuid,
            language: learningObject.language,
            start_node: node.startNode,
            created_at: node.createdAt.toISOString(),
            updatedAt: node.updatedAt.toISOString(),
            learningobject_hruid: node.learningObjectHruid,
            version: learningObject.version,
            transitions: node.transitions.map((trans, i) =>
                convertTransition(trans, i, nodesToLearningObjects)
            )
        }
    }).toArray();
}

/**
 * Helper function which converts a transition in the database representation to a transition in the representation
 * the Dwengo API uses.
 *
 * @param transition
 * @param index
 * @param nodesToLearningObjects
 */
function convertTransition(
    transition: LearningPathTransition,
    index: number,
    nodesToLearningObjects: Map<LearningPathNode, FilteredLearningObject>
): Transition {
    const nextNode = nodesToLearningObjects.get(transition.next);
    if (!nextNode) {
        throw new Error(`Learning object ${transition.next.learningObjectHruid}/${transition.next.language}/${transition.next.version} not found!`)
    } else {
        return {
            _id: "" + index, // Retained for backwards compatibility. The index uniquely identifies the transition within the learning path.
            default: false, // We don't work with default transitions but retain this for backwards compatibility.
            next: {
                _id: nextNode._id + index, // Construct a unique ID for the transition for backwards compatibility.
                hruid: transition.next.learningObjectHruid,
                language: nextNode.language,
                version: nextNode.version
            }
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
    async fetchLearningPaths(hruids: string[], language: Language, source: string): Promise<LearningPathResponse> {
        const learningPathRepo = getLearningPathRepository();

        const learningPaths = await Promise.all(
            hruids.map(hruid => learningPathRepo.findByHruidAndLanguage(hruid, language))
        );
        const filteredLearningPaths = await Promise.all(
            learningPaths
                .filter(learningPath => learningPath !== null)
                .map((learningPath, index) => convertLearningPath(learningPath, index))
        );

        return {
            success: filteredLearningPaths.length > 0,
            data: await Promise.all(filteredLearningPaths),
            source
        };
    },

    /**
     * Search learning paths in the database using the given search string.
     */
    async searchLearningPaths(query: string, language: Language): Promise<LearningPath[]> {
        const learningPathRepo = getLearningPathRepository();

        const searchResults = await learningPathRepo.findByQueryStringAndLanguage(query, language);
        return await Promise.all(
            searchResults.map((result, index) =>
                convertLearningPath(result, index)
            )
        );
    }
}

export default databaseLearningPathProvider;
