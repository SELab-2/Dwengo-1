import {
    Embeddable,
    Embedded,
    Entity,
    Enum,
    ManyToMany,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Language } from './language.js';
import { Attachment } from './attachment.entity.js';
import { Teacher } from '../users/teacher.entity.js';

/**
 * @swagger
 * tags:
 *   name: LearningObject
 *   description: API for managing learning objects
 * components:
 *   schemas:
 *     LearningObject:
 *       type: object
 *       properties:
 *         hruid:
 *           type: string
 *         language:
 *           $ref: '#/components/schemas/Language'
 *         version:
 *           type: string
 *           default: '1'
 *         admins:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Teacher'
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         contentType:
 *           type: string
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *         targetAges:
 *           type: array
 *           items:
 *             type: integer
 *           nullable: true
 *         teacherExclusive:
 *           type: boolean
 *           default: false
 *         skosConcepts:
 *           type: array
 *           items:
 *             type: string
 *         educationalGoals:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EducationalGoal'
 *         copyright:
 *           type: string
 *           default: ''
 *         license:
 *           type: string
 *           default: ''
 *         difficulty:
 *           type: integer
 *           nullable: true
 *         estimatedTime:
 *           type: integer
 *         returnValue:
 *           $ref: '#/components/schemas/ReturnValue'
 *         available:
 *           type: boolean
 *           default: true
 *         contentLocation:
 *           type: string
 *           nullable: true
 *         attachments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Attachment'
 *         content:
 *           type: string
 *           format: binary
 */
@Entity()
export class LearningObject {
    @PrimaryKey({ type: 'string' })
    hruid!: string;

    @Enum({
        items: () => {
            return Language;
        },
        primary: true,
    })
    language!: Language;

    @PrimaryKey({ type: 'string' })
    version: string = '1';

    @ManyToMany({
        entity: () => {
            return Teacher;
        },
    })
    admins!: Teacher[];

    @Property({ type: 'string' })
    title!: string;

    @Property({ type: 'text' })
    description!: string;

    @Property({ type: 'string' })
    contentType!: string;

    @Property({ type: 'array' })
    keywords: string[] = [];

    @Property({ type: 'array', nullable: true })
    targetAges?: number[];

    @Property({ type: 'bool' })
    teacherExclusive: boolean = false;

    @Property({ type: 'array' })
    skosConcepts!: string[];

    @Embedded({
        entity: () => {
            return EducationalGoal;
        },
        array: true,
    })
    educationalGoals: EducationalGoal[] = [];

    @Property({ type: 'string' })
    copyright: string = '';

    @Property({ type: 'string' })
    license: string = '';

    @Property({ type: 'smallint', nullable: true })
    difficulty?: number;

    @Property({ type: 'integer' })
    estimatedTime!: number;

    @Embedded({
        entity: () => {
            return ReturnValue;
        },
    })
    returnValue!: ReturnValue;

    @Property({ type: 'bool' })
    available: boolean = true;

    @Property({ type: 'string', nullable: true })
    contentLocation?: string;

    @OneToMany({
        entity: () => {
            return Attachment;
        },
        mappedBy: 'learningObject',
    })
    attachments: Attachment[] = [];

    @Property({ type: 'blob' })
    content!: Buffer;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EducationalGoal:
 *       type: object
 *       properties:
 *         source:
 *           type: string
 *         id:
 *           type: string
 */
@Embeddable()
export class EducationalGoal {
    @Property({ type: 'string' })
    source!: string;

    @Property({ type: 'string' })
    id!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ReturnValue:
 *       type: object
 *       properties:
 *         callbackUrl:
 *           type: string
 *           format: uri
 *         callbackSchema:
 *           type: string
 *       required:
 *         - callbackUrl
 *         - callbackSchema
 */
@Embeddable()
export class ReturnValue {
    @Property({ type: 'string' })
    callbackUrl!: string;

    @Property({ type: 'json' })
    callbackSchema!: string;
}

export enum ContentType {
    Markdown = 'text/markdown',
    Image = 'image/image',
    Mpeg = 'audio/mpeg',
    Pdf = 'application/pdf',
    Extern = 'extern',
    Blockly = 'Blockly',
}
