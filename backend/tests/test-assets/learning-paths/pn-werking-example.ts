import {LearningPath, LearningPathNode} from "../../../src/entities/content/learning-path.entity";
import {Language} from "../../../src/entities/content/language";
import {EnvVars, getEnvVar} from "../../../src/util/envvars";
import {createLearningPathNode, createLearningPathTransition} from "./learning-path-utils";

function createNodes(): LearningPathNode[] {
    let nodes = [
        createLearningPathNode("u_pn_werkingnotebooks", 3, Language.Dutch, true),
        createLearningPathNode("pn_werkingnotebooks2", 3, Language.Dutch, false),
        createLearningPathNode("pn_werkingnotebooks3", 3, Language.Dutch, false),
    ];
    nodes[0].transitions.push(createLearningPathTransition("true", nodes[1]));
    nodes[1].transitions.push(createLearningPathTransition("true", nodes[2]));
    return nodes;
}

const example: LearningPathExample = {
    createLearningPath: () => {
        const path = new LearningPath();
        path.language = Language.Dutch;
        path.hruid = `${getEnvVar(EnvVars.UserContentPrefix)}pn_werking`;
        path.title = "Werken met notebooks";
        path.description = "Een korte inleiding tot Python notebooks. Hoe ga je gemakkelijk en efficiënt met de notebooks aan de slag?";
        path.nodes = createNodes();
        return path;
    }
}

export default example;
