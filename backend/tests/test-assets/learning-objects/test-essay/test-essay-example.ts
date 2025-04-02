import { LearningObjectExample } from '../learning-object-example';
import { LearningObject } from '../../../../src/entities/content/learning-object.entity';
import { loadTestAsset } from '../../../test-utils/load-test-asset';
import { envVars, getEnvVar } from '../../../../src/util/envVars';
import { Language } from '@dwengo-1/common/util/language';
import { DwengoContentType } from '../../../../src/services/learning-objects/processing/content-type';

const example: LearningObjectExample = {
    createLearningObject: () => {
        const learningObject = new LearningObject();
        learningObject.hruid = `${getEnvVar(envVars.UserContentPrefix)}test_essay`;
        learningObject.language = Language.English;
        learningObject.version = 1;
        learningObject.title = 'Essay question for testing';
        learningObject.description = 'This essay question was only created for testing purposes.';
        learningObject.contentType = DwengoContentType.GIFT;
        learningObject.returnValue = {
            callbackUrl: `/learningObject/${learningObject.hruid}/submissions`,
            callbackSchema: '["antwoord vraag 1"]',
        };
        learningObject.content = loadTestAsset('learning-objects/test-essay/content.txt');
        return learningObject;
    },
    createAttachment: {},
    getHTMLRendering: () => loadTestAsset('learning-objects/test-essay/rendering.txt').toString(),
};

export default example;
