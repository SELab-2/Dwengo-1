import { LearningObjectExample } from '../learning-object-example';
import { LearningObject } from '../../../../src/entities/content/learning-object.entity';
import { loadTestAsset } from '../../../test-utils/load-test-asset';
import { envVars, getEnvVar } from '../../../../src/util/envVars';
import { Language } from '../../../../src/entities/content/language';
import { DwengoContentType } from '../../../../src/services/learning-objects/processing/content-type';

const example: LearningObjectExample = {
    createLearningObject: () => {
        const learningObject = new LearningObject();
        learningObject.hruid = `${getEnvVar(envVars.UserContentPrefix)}test_multiple_choice`;
        learningObject.language = Language.English;
        learningObject.version = 1;
        learningObject.title = 'Multiple choice question for testing';
        learningObject.description = 'This multiple choice question was only created for testing purposes.';
        learningObject.contentType = DwengoContentType.GIFT;
        learningObject.returnValue = {
            callbackUrl: `/learningObject/${learningObject.hruid}/submissions`,
            callbackSchema: '["antwoord vraag 1"]',
        };
        learningObject.content = loadTestAsset('learning-objects/test-multiple-choice/content.txt');
        return learningObject;
    },
    createAttachment: {},
    getHTMLRendering: () => loadTestAsset('learning-objects/test-multiple-choice/rendering.txt').toString(),
};

export default example;
