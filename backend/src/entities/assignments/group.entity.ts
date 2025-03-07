import { Entity, ManyToMany, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Assignment } from './assignment.entity.js';
import { Student } from '../users/student.entity.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         assignment:
 *           $ref: '#/components/schemas/Assignment'
 *         groupNumber:
 *           type: number
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Student'
 *       required:
 *         - assignment
 *         - groupNumber
 *         - members
 */
@Entity()
export class Group {
    @ManyToOne({
        entity: () => {
            return Assignment;
        },
        primary: true,
    })
    assignment!: Assignment;

    @PrimaryKey({ type: 'integer' })
    groupNumber!: number;

    @ManyToMany({
        entity: () => {
            return Student;
        },
    })
    members!: Student[];
}
