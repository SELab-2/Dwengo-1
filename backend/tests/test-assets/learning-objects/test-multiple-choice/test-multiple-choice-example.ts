import {LearningObjectExample} from "../learning-object-example";
import {LearningObject} from "../../../../src/entities/content/learning-object.entity";
import {loadTestAsset} from "../../../test-utils/load-test-asset";
import {EnvVars, getEnvVar} from "../../../../src/util/envvars";
import {Language} from "../../../../src/entities/content/language";

const example: LearningObjectExample = {
    createLearningObject: () => {
        const learningObject = new LearningObject();
        learningObject.hruid = `${getEnvVar(EnvVars.UserContentPrefix)}test_multiple_choice`;
        learningObject.language = Language.English;
        learningObject.version = 1;
        learningObject.title = "Multiple choice question for testing";
        learningObject.description = "This multiple choice question was only created for testing purposes.";
        learningObject.content = loadTestAsset("learning-objects/test-multiple-choice/content.txt");
        return learningObject;
    },
    createAttachment: {},
    getHTMLRendering: () => loadTestAsset("learning-objects/test-multiple-choice/rendering.html").toString()
};

export default example;
