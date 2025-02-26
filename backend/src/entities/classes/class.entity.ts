import {
    Collection,
    Entity,
    ManyToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Teacher } from '../users/teacher.entity';
import { Student } from '../users/student.entity';

@Entity()
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
