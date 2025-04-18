import { EntityManager } from '@mikro-orm/core';
import { Group } from '../../../src/entities/assignments/group.entity';
import { Assignment } from '../../../src/entities/assignments/assignment.entity';
import { Student } from '../../../src/entities/users/student.entity';

let group01: Group;
let group02: Group;
let group03: Group;
let group04: Group;
let group05: Group;

export let TEST_GROUP_LIST: Group[];

export function makeTestGroups(em: EntityManager, students: Student[], assignments: Assignment[]): Group[] {
    group01 = em.create(Group, {
        assignment: assignments[0],
        groupNumber: 1,
        members: students.slice(0, 2),
    });

    group02 = em.create(Group, {
        assignment: assignments[0],
        groupNumber: 2,
        members: students.slice(2, 4),
    });

    group03 = em.create(Group, {
        assignment: assignments[0],
        groupNumber: 3,
        members: students.slice(4, 6),
    });

    group04 = em.create(Group, {
        assignment: assignments[1],
        groupNumber: 4,
        members: students.slice(3, 4),
    });

    group05 = em.create(Group, {
        assignment: assignments[3],
        groupNumber: 1,
        members: students.slice(0, 2),
    });

    TEST_GROUP_LIST = [group01, group02, group03, group04, group05];
    return TEST_GROUP_LIST;
}
