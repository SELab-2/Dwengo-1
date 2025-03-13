import { Entity, ManyToMany, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Assignment } from './assignment.entity.js';
import { Student } from '../users/student.entity.js';
import { GroupRepository } from '../../data/assignments/group-repository.js';

@Entity({
    repository: () => {
        return GroupRepository;
    },
})
export class Group {
    @ManyToOne({
        entity: () => {
            return Assignment;
        },
        primary: true,
    })
    assignment!: Assignment;

    @PrimaryKey({ type: 'integer', autoincrement: true })
    groupNumber?: number;

    @ManyToMany({
        entity: () => {
            return Student;
        },
    })
    members!: Student[];
}
