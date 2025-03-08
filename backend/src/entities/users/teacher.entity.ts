import { Collection, Entity, ManyToMany } from '@mikro-orm/core';
import { User } from './user.entity.js';
import { Class } from '../classes/class.entity.js';
import {TeacherRepository} from "../../data/users/teacher-repository";

@Entity({repository: () => TeacherRepository})
export class Teacher extends User {
    @ManyToMany(() => Class)
    classes!: Collection<Class>;
}
