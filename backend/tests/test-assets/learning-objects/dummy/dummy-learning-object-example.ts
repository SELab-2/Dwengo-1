import { LearningObjectExample } from '../learning-object-example';
import { Language } from 'dwengo-1-common/src/util/language';
import { LearningObject } from '../../../../src/entities/content/learning-object.entity';
import { loadTestAsset } from '../../../test-utils/load-test-asset';
import { DwengoContentType } from '../../../../src/services/learning-objects/processing/content-type';
import { envVars, getEnvVar } from '../../../../src/util/envVars';

/**
 * Create a dummy learning object to be used in tests where multiple learning objects are needed (for example for use
 * on a path), but where the precise contents of the learning object are not important.
 */
export function dummyLearningObject(hruid: string, language: Language, title: string): LearningObjectExample {
    return {
        createLearningObject: (): LearningObject => {
            const learningObject = new LearningObject();
            learningObject.hruid = getEnvVar(envVars.UserContentPrefix) + hruid;
            learningObject.language = language;
            learningObject.version = 1;
            learningObject.title = title;
            learningObject.description = 'Just a dummy learning object for testing purposes';
            learningObject.contentType = DwengoContentType.TEXT_PLAIN;
            learningObject.content = Buffer.from('Dummy content');
            learningObject.returnValue = {
                callbackUrl: `/learningObject/${hruid}/submissions`,
                callbackSchema: '[]',
            };
            return learningObject;
        },
        createAttachment: {},
        getHTMLRendering: () => loadTestAsset('learning-objects/dummy/rendering.txt').toString(),
    };
}
