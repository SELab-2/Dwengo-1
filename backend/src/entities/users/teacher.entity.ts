import { Collection, Entity, ManyToMany } from '@mikro-orm/core';
import { User } from './user.entity.js';
import { Class } from '../classes/class.entity.js';
import { TeacherRepository } from '../../data/users/teacher-repository.js';

@Entity({ repository: () => TeacherRepository })
export class Teacher extends User {
    @ManyToMany({ entity: () => Class, mappedBy: 'teachers' })
    classes!: Collection<Class>;
}
