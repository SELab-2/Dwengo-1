import {Language} from "../../../src/entities/content/language";
import {LearningPathTransition} from "../../../src/entities/content/learning-path-transition.entity";
import {LearningPathNode} from "../../../src/entities/content/learning-path-node.entity";

export function createLearningPathTransition(condition: string | null, to: LearningPathNode) {
    let trans = new LearningPathTransition();
    trans.condition = condition || "true";
    trans.next = to;
    return trans;
}

export function createLearningPathNode(
    learningObjectHruid: string,
    version: number,
    language: Language,
    startNode: boolean
) {
    let node = new LearningPathNode();
    node.learningObjectHruid = learningObjectHruid;
    node.version = version;
    node.language = language;
    node.startNode = startNode;
    return node;
}
