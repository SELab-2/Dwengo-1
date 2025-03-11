import { Entity, ManyToMany, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Assignment } from './assignment.entity.js';
import { Student } from '../users/student.entity.js';
import { GroupRepository } from '../../data/assignments/group-repository';

@Entity({ repository: () => GroupRepository })
export class Group {
    @ManyToOne({
        entity: () => Assignment,
        primary: true,
    })
    assignment!: Assignment;

    @PrimaryKey({ type: 'integer' })
    groupNumber!: number;

    @ManyToMany({
        entity: () => Student,
    })
    members!: Student[];
}
