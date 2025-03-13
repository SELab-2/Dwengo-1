import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Attachment } from '../../../src/entities/content/attachment.entity';
import { LearningObject } from '../../../src/entities/content/learning-object.entity';

export function makeTestAttachments(em: EntityManager<IDatabaseDriver<Connection>>, learningObjects: Array<LearningObject>): Array<Attachment> {
    const attachment01 = em.create(Attachment, {
        learningObject: learningObjects[1],
        name: 'attachment01',
        mimeType: '',
        content: Buffer.from(''),
    });

    return [attachment01];
}
