import { LearningObject } from '../../../src/entities/content/learning-object.entity';
import { Attachment } from '../../../src/entities/content/attachment.entity';

type LearningObjectExample = {
    createLearningObject: () => LearningObject;
    createAttachment: { [key: string]: (owner: LearningObject) => Attachment };
    getHTMLRendering: () => string;
};
