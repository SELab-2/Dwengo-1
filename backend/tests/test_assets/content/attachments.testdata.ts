import { EntityManager } from '@mikro-orm/core';
import { Attachment } from '../../../src/entities/content/attachment.entity';
import { testLearningObject01 } from './learning-objects.testdata';
import { LearningObject } from '../../../src/entities/content/learning-object.entity';

export function makeTestAttachments(em: EntityManager): Attachment[] {
    // Prevent duplicate insertion
    const lo = em.merge(LearningObject, testLearningObject01);

    attachment01 = em.create(Attachment, {
        learningObject: lo,
        name: 'attachment01',
        mimeType: '',
        content: Buffer.from(''),
    });

    return [attachment01];
}

let attachment01: Attachment;

export function getAttachment01(): Attachment {
    return attachment01;
}
