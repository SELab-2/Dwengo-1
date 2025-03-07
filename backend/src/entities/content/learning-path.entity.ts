import {
    Embeddable,
    Embedded,
    Entity,
    Enum,
    ManyToMany,
    OneToOne,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Language } from './language.js';
import { Teacher } from '../users/teacher.entity.js';

/**
 * @swagger
 * tags:
 *   name: LearningPath
 *   description: API for managing learning paths
 * components:
 *   schemas:
 *     LearningPath:
 *       type: object
 *       required:
 *         - hruid
 *         - language
 *         - admins
 *         - title
 *         - description
 *         - image
 *       properties:
 *         hruid:
 *           type: string
 *           description: Human readable identifier
 *         language:
 *           description: Language of the learning path
 *           schema:
 *             $ref: '#/components/schemas/Language'
 *         admins:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Teacher'
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         nodes:
 *           type: array
 *           items:
 *             schema:
 *               $ref: '#/components/schemas/LearningPathNode'
 */
@Entity()
export class LearningPath {
    @PrimaryKey({ type: 'string' })
    hruid!: string;

    @Enum({
        items: () => {
            return Language;
        },
        primary: true,
    })
    language!: Language;

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

    @Property({ type: 'blob' })
    image!: string;

    @Embedded({
        entity: () => {
            return LearningPathNode;
        },
        array: true,
    })
    nodes: LearningPathNode[] = [];
}

@Embeddable()
export class LearningPathNode {
    @Property({ type: 'string' })
    learningObjectHruid!: string;

    @Enum({
        items: () => {
            return Language;
        },
    })
    language!: Language;

    @Property({ type: 'string' })
    version!: string;

    @Property({ type: 'longtext' })
    instruction!: string;

    @Property({ type: 'bool' })
    startNode!: boolean;

    @Embedded({
        entity: () => {
            return LearningPathTransition;
        },
        array: true,
    })
    transitions!: LearningPathTransition[];
}

@Embeddable()
export class LearningPathTransition {
    @Property({ type: 'string' })
    condition!: string;

    @OneToOne({
        entity: () => {
            return LearningPathNode;
        },
    })
    next!: LearningPathNode;
}
