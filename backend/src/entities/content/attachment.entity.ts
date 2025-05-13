import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { LearningObject } from './learning-object.entity.js';
import { AttachmentRepository } from '../../data/content/attachment-repository.js';

@Entity({
    repository: () => AttachmentRepository,
})
export class Attachment {
    @ManyToOne({
        entity: () => LearningObject,
        primary: true,
        deleteRule: 'cascade',
    })
    learningObject!: LearningObject;

    @PrimaryKey({ type: 'string' })
    name!: string;

    @Property({ type: 'string' })
    mimeType!: string;

    @Property({ type: 'blob' })
    content!: Buffer;
}
