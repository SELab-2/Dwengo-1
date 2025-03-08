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
import {ClassRepository} from "../../data/classes/class-repository";

@Entity({repository: () => ClassRepository})
export class Class {
    @PrimaryKey()
    classId = v4();

    @Property({ type: 'string' })
    displayName!: string;

    @ManyToMany(() => Teacher)
    teachers!: Collection<Teacher>;

    @ManyToMany(() => Student)
    students!: Collection<Student>;
}
