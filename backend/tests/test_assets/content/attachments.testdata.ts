import { EntityManager } from '@mikro-orm/core';
import { Attachment } from '../../../src/entities/content/attachment.entity';
import { testLearningObject01 } from './learning-objects.testdata';

export function makeTestAttachments(em: EntityManager): Attachment[] {
    attachment01 = em.create(Attachment, {
        learningObject: testLearningObject01,
        name: 'attachment01',
        mimeType: '',
        content: Buffer.from(''),
    });

    return [attachment01];
}

let attachment01: Attachment;

export function getAttachment01(): Attachment{
    return attachment01;
}
