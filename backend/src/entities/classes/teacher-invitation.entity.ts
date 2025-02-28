import { Entity, ManyToOne } from '@mikro-orm/core';
import { Teacher } from '../users/teacher.entity.js';
import { Class } from './class.entity.js';

/**
 * Invitation of a teacher into a class (in order to teach it).
 */
@Entity()
export class TeacherInvitation {
    @ManyToOne({ entity: () => Teacher, primary: true })
    sender!: Teacher;

    @ManyToOne({ entity: () => Teacher, primary: true })
    receiver!: Teacher;

    @ManyToOne({ entity: () => Class, primary: true })
    class!: Class;
}
