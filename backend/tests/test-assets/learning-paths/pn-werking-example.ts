import {LearningPath} from "../../../src/entities/content/learning-path.entity";
import {Language} from "../../../src/entities/content/language";
import {EnvVars, getEnvVar} from "../../../src/util/envvars";
import {createLearningPathNode, createLearningPathTransition} from "./learning-path-utils";
import {LearningPathNode} from "../../../src/entities/content/learning-path-node.entity";

function createNodes(learningPath: LearningPath): LearningPathNode[] {
    let nodes = [
        createLearningPathNode(learningPath, 0, "u_pn_werkingnotebooks", 3, Language.Dutch, true),
        createLearningPathNode(learningPath, 1, "pn_werkingnotebooks2", 3, Language.Dutch, false),
        createLearningPathNode(learningPath, 2, "pn_werkingnotebooks3", 3, Language.Dutch, false),
    ];
    nodes[0].transitions.push(createLearningPathTransition(nodes[0], 0, "true", nodes[1]));
    nodes[1].transitions.push(createLearningPathTransition(nodes[1], 0, "true", nodes[2]));
    return nodes;
}

const example: LearningPathExample = {
    createLearningPath: () => {
        const path = new LearningPath();
        path.language = Language.Dutch;
        path.hruid = `${getEnvVar(EnvVars.UserContentPrefix)}pn_werking`;
        path.title = "Werken met notebooks";
        path.description = "Een korte inleiding tot Python notebooks. Hoe ga je gemakkelijk en efficiënt met de notebooks aan de slag?";
        path.nodes = createNodes(path);
        return path;
    }
}

export default example;
