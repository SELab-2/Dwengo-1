import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey} from '@mikro-orm/core';
import { Assignment } from './assignment.entity.js';
import { Student } from '../users/student.entity.js';
import { GroupRepository } from '../../data/assignments/group-repository.js';

@Entity({
    repository: () => GroupRepository,
})
export class Group {
    /*
     WARNING: Don't move the definition of groupNumber! If it does not come before the definition of assignment,
     creating groups fails because of a MikroORM bug!
     */
    @PrimaryKey({ type: 'integer', autoincrement: true })
    groupNumber?: number;

    @ManyToOne({
        entity: () => Assignment,
        primary: true,
    })
    assignment!: Assignment;

    @ManyToMany({
        entity: () => Student,
        owner: true,
        inversedBy: 'groups',
    })
    members: Collection<Student> = new Collection<Student>(this);
}
