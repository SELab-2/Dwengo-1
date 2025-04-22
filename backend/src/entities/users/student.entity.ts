import { User } from './user.entity.js';
import { Collection, Entity, ManyToMany } from '@mikro-orm/core';
import { Class } from '../classes/class.entity.js';
import { Group } from '../assignments/group.entity.js';
import { StudentRepository } from '../../data/users/student-repository.js';

@Entity({
    repository: () => StudentRepository,
})
export class Student extends User {
    @ManyToMany({ entity: () => Class, mappedBy: 'students' })
    classes!: Collection<Class>;

    @ManyToMany({ entity: () => Group, mappedBy: 'members' })
    groups: Collection<Group> = new Collection<Group>(this);
}
