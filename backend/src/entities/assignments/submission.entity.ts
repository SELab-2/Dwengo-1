import { Student } from '../users/student.entity.js';
import { Group } from './group.entity.js';
import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Language } from '../content/language.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Submission:
 *       type: object
 *       properties:
 *         learningObjectHruid:
 *           type: string
 *         learningObjectLanguage:
 *           $ref: '#/components/schemas/Language'
 *         learningObjectVersion:
 *           type: string
 *           default: '1'
 *         submissionNumber:
 *           type: number
 *         submitter:
 *           $ref: '#/components/schemas/Student'
 *         submissionTime:
 *           type: string
 *           format: date-time
 *         onBehalfOf:
 *           $ref: '#/components/schemas/Group'
 *         content:
 *           type: string
 *       required:
 *         - learningObjectHruid
 *         - learningObjectLanguage
 *         - submissionNumber
 *         - submitter
 *         - submissionTime
 *         - content
 */
@Entity()
export class Submission {
    @PrimaryKey({ type: 'string' })
    learningObjectHruid!: string;

    @Enum({
        items: () => {
            return Language;
        },
        primary: true,
    })
    learningObjectLanguage!: Language;

    @PrimaryKey({ type: 'string' })
    learningObjectVersion: string = '1';

    @PrimaryKey({ type: 'integer' })
    submissionNumber!: number;

    @ManyToOne({
        entity: () => {
            return Student;
        },
    })
    submitter!: Student;

    @Property({ type: 'datetime' })
    submissionTime!: Date;

    @ManyToOne({
        entity: () => {
            return Group;
        },
        nullable: true,
    })
    onBehalfOf?: Group;

    @Property({ type: 'json' })
    content!: string;
}
