import { LearningObjectExample } from './learning-object-example';
import { LearningObject } from '../../../src/entities/content/learning-object.entity';

export function createExampleLearningObjectWithAttachments(example: LearningObjectExample): LearningObject {
    const learningObject = example.createLearningObject();
    for (const creationFn of Object.values(example.createAttachment)) {
        learningObject.attachments.push(creationFn(learningObject));
    }
    return learningObject;
}
