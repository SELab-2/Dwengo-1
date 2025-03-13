import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Assignment } from './assignment.entity.js';
import { Student } from '../users/student.entity.js';

@Entity({
    repository: () => {
        return GroupRepository;
    },
})
export class Group {
    @ManyToOne({
        entity: () => Assignment,
        primary: true,
    })
    assignment!: Assignment;

    @PrimaryKey({ type: 'integer', autoincrement: true })
    groupNumber?: number;

    @ManyToMany({
        entity: () => Student,
    })
    members!: Student[];
}
