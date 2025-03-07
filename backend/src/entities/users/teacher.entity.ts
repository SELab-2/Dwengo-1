import { Collection, Entity, ManyToMany } from '@mikro-orm/core';
import { User } from './user.entity.js';
import { Class } from '../classes/class.entity.js';

/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: API for managing teachers
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - classes
 *       properties:
 *         classes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Class'
 */
@Entity()
export class Teacher extends User {
    @ManyToMany(() => {
        return Class;
    })
    classes!: Collection<Class>;
}
