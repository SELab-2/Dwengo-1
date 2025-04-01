import { LearningObjectExample } from '../learning-object-example';
import { Language } from 'dwengo-1-common/src/util/language';
import { DwengoContentType } from '../../../../src/services/learning-objects/processing/content-type';
import { loadTestAsset } from '../../../test-utils/load-test-asset';
import { LearningObject } from '../../../../src/entities/content/learning-object.entity';
import { Attachment } from '../../../../src/entities/content/attachment.entity';
import { envVars, getEnvVar } from '../../../../src/util/envVars';
import { EducationalGoal } from '../../../../src/entities/content/educational-goal.entity';
import { ReturnValue } from '../../../../src/entities/content/return-value.entity';

const ASSETS_PREFIX = 'learning-objects/pn-werkingnotebooks/';

const example: LearningObjectExample = {
    createLearningObject: () => {
        const learningObject = new LearningObject();
        learningObject.hruid = `${getEnvVar(envVars.UserContentPrefix)}pn_werkingnotebooks`;
        learningObject.version = 3;
        learningObject.language = Language.Dutch;
        learningObject.title = 'Werken met notebooks';
        learningObject.description = 'Leren werken met notebooks';
        learningObject.keywords = ['Python', 'KIKS', 'Wiskunde', 'STEM', 'AI'];

        const educationalGoal1 = new EducationalGoal();
        educationalGoal1.source = 'Source';
        educationalGoal1.id = 'id';

        const educationalGoal2 = new EducationalGoal();
        educationalGoal2.source = 'Source2';
        educationalGoal2.id = 'id2';

        learningObject.educationalGoals = [educationalGoal1, educationalGoal2];
        learningObject.admins = [];
        learningObject.contentType = DwengoContentType.TEXT_MARKDOWN;
        learningObject.teacherExclusive = false;
        learningObject.skosConcepts = [
            'http://ilearn.ilabt.imec.be/vocab/curr1/s-vaktaal',
            'http://ilearn.ilabt.imec.be/vocab/curr1/s-digitale-media-en-toepassingen',
            'http://ilearn.ilabt.imec.be/vocab/curr1/s-computers-en-systemen',
        ];
        learningObject.copyright = 'dwengo';
        learningObject.license = 'dwengo';
        learningObject.estimatedTime = 10;

        const returnValue = new ReturnValue();
        returnValue.callbackUrl = 'callback_url_example';
        returnValue.callbackSchema = '{"att": "test", "att2": "test2"}';

        learningObject.returnValue = returnValue;
        learningObject.available = true;
        learningObject.content = loadTestAsset(`${ASSETS_PREFIX}/content.md`);

        return learningObject;
    },
    createAttachment: {
        dwengoLogo: (learningObject) => {
            const att = new Attachment();
            att.learningObject = learningObject;
            att.name = 'dwengo.png';
            att.mimeType = 'image/png';
            att.content = loadTestAsset(`${ASSETS_PREFIX}/dwengo.png`);
            return att;
        },
        knop: (learningObject) => {
            const att = new Attachment();
            att.learningObject = learningObject;
            att.name = 'Knop.png';
            att.mimeType = 'image/png';
            att.content = loadTestAsset(`${ASSETS_PREFIX}/Knop.png`);
            return att;
        },
    },
    getHTMLRendering: () => loadTestAsset(`${ASSETS_PREFIX}/rendering.txt`).toString(),
};
export default example;
