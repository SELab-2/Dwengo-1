import { User } from './user.entity.js';
import { Collection, Entity, ManyToMany } from '@mikro-orm/core';
import { Class } from '../classes/class.entity.js';
import { Group } from '../assignments/group.entity.js';
import { StudentRepository } from '../../data/users/student-repository.js';

@Entity({
    repository: () => {
        return StudentRepository;
    },
})
export class Student extends User {
    @ManyToMany(() => {
        return Class;
    })
    classes!: Collection<Class>;

    @ManyToMany(() => {
        return Group;
    })
    groups!: Collection<Group>;

    constructor(
        public username: string,
        public firstName: string,
        public lastName: string
    ) {
        super();
    }
}
