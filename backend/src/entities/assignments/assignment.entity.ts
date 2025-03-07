import {
    Entity,
    Enum,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Class } from '../classes/class.entity.js';
import { Group } from './group.entity.js';
import { Language } from '../content/language.js';

/**
 * @swagger
 * tags:
 *   name: Assignment
 *   description: Assignment management
 * components:
 *   schemas:
 *     Assignment:
 *       type: object
 *       properties:
 *         within:
 *           $ref: '#/components/schemas/Class'
 *         id:
 *           type: number
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         learningPathHruid:
 *           type: string
 *         learningPathLanguage:
 *           $ref: '#/components/schemas/Language'
 *         groups:
 *           type: array
 *           items:
 *             type: string
 *             description: ID of a group
 *         links:
 *           type: object
 *           properties:
 *             self:
 *               type: string
 *               description: Path to the assignment
 *               example: '/assignment/0'
 *             submissions:
 *               type: array
 *               items:
 *                 type: string
 *                 description: Path to the submissions for this assignment
 *                 example: '/assignment/0/submissions'
 *       required:
 *         - within
 *         - id
 *         - title
 *         - description
 *         - learningPathHruid
 *         - learningPathLanguage
 *         - groups
 */
@Entity()
export class Assignment {
    @ManyToOne({
        entity: () => {
            return Class;
        },
        primary: true,
    })
    within!: Class;

    @PrimaryKey({ type: 'number' })
    id!: number;

    @Property({ type: 'string' })
    title!: string;

    @Property({ type: 'text' })
    description!: string;

    @Property({ type: 'string' })
    learningPathHruid!: string;

    @Enum({
        items: () => {
            return Language;
        },
    })
    learningPathLanguage!: Language;

    @OneToMany({
        entity: () => {
            return Group;
        },
        mappedBy: 'assignment',
    })
    groups!: Group[];
}
