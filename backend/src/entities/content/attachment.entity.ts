import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { LearningObject } from './learning-object.entity.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Attachment:
 *       type: object
 *       properties:
 *         learningObject:
 *           $ref: '#/components/schemas/LearningObject'
 *         sequenceNumber:
 *           type: integer
 *         mimeType:
 *           type: string
 *         content:
 *           type: string
 *           format: binary
 *       required:
 *         - learningObject
 *         - sequenceNumber
 *         - mimeType
 *         - content
 */
@Entity()
export class Attachment {
    @ManyToOne({
        entity: () => {
            return LearningObject;
        },
        primary: true,
    })
    learningObject!: LearningObject;

    @PrimaryKey({ type: 'integer' })
    sequenceNumber!: number;

    @Property({ type: 'string' })
    mimeType!: string;

    @Property({ type: 'blob' })
    content!: Buffer;
}
