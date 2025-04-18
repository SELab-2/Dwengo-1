import { EntityManager } from '@mikro-orm/core';
import { Attachment } from '../../../src/entities/content/attachment.entity';
import { LearningObject } from '../../../src/entities/content/learning-object.entity';

export let attachment01: Attachment;
export let TEST_ATTACHMENTS: Attachment[];

export function makeTestAttachments(em: EntityManager, learningObjects: LearningObject[]): Attachment[] {
    attachment01 = em.create(Attachment, {
        learningObject: learningObjects[1],
        name: 'attachment01',
        mimeType: '',
        content: Buffer.from(''),
    });

    TEST_ATTACHMENTS = [attachment01];
    return TEST_ATTACHMENTS;
}
