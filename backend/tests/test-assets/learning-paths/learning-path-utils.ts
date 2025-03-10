import {Language} from "../../../src/entities/content/language";
import {LearningPathTransition} from "../../../src/entities/content/learning-path-transition.entity";
import {LearningPathNode} from "../../../src/entities/content/learning-path-node.entity";
import {LearningPath} from "../../../src/entities/content/learning-path.entity";

export function createLearningPathTransition(node: LearningPathNode, transitionNumber: number, condition: string | null, to: LearningPathNode) {
    let trans = new LearningPathTransition();
    trans.node = node;
    trans.transitionNumber = transitionNumber;
    trans.condition = condition || "true";
    trans.next = to;
    return trans;
}

export function createLearningPathNode(
    learningPath: LearningPath,
    nodeNumber: number,
    learningObjectHruid: string,
    version: number,
    language: Language,
    startNode: boolean
) {
    let node = new LearningPathNode();
    node.learningPath = learningPath;
    node.nodeNumber = nodeNumber;
    node.learningObjectHruid = learningObjectHruid;
    node.version = version;
    node.language = language;
    node.startNode = startNode;
    return node;
}
