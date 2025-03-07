import {
    Collection,
    Entity,
    ManyToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Teacher } from '../users/teacher.entity.js';
import { Student } from '../users/student.entity.js';

/**
 * @swagger
 * tags:
 *   name: Class
 *   description: API for managing classes
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       properties:
 *         classId:
 *           type: integer
 *           format: int8
 *         displayName:
 *           type: string
 *         teachers:
 *           type: array
 *           items:
 *             type: string
 *             description: The id of a teacher
 *         students:
 *           type: array
 *           items:
 *             type: string
 *             description: The id of a student
 *       required:
 *         - teachers
 *         - students
 */
@Entity()
export class Class {
    @PrimaryKey()
    classId = v4();

    @Property({ type: 'string' })
    displayName!: string;

    @ManyToMany(() => {
        return Teacher;
    })
    teachers!: Collection<Teacher>;

    @ManyToMany(() => {
        return Student;
    })
    students!: Collection<Student>;
}
