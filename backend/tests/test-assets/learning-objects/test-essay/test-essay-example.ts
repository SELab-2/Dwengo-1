import { LearningObjectExample } from '../learning-object-example';
import { LearningObject } from '../../../../src/entities/content/learning-object.entity';
import { loadTestAsset } from '../../../test-utils/load-test-asset';
import { EnvVars, getEnvVar } from '../../../../src/util/envvars';
import { Language } from '../../../../src/entities/content/language';
import { DwengoContentType } from '../../../../src/services/learning-objects/processing/content-type';

const example: LearningObjectExample = {
    createLearningObject: () => {
        const learningObject = new LearningObject();
        learningObject.hruid = `${getEnvVar(EnvVars.UserContentPrefix)}test_essay`;
        learningObject.language = Language.English;
        learningObject.version = 1;
        learningObject.title = 'Essay question for testing';
        learningObject.description = 'This essay question was only created for testing purposes.';
        learningObject.contentType = DwengoContentType.GIFT;
        learningObject.content = loadTestAsset('learning-objects/test-essay/content.txt');
        return learningObject;
    },
    createAttachment: {},
    getHTMLRendering: () => loadTestAsset('learning-objects/test-essay/rendering.html').toString(),
};

export default example;
