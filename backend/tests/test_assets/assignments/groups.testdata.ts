import {EntityManager} from '@mikro-orm/core';
import { Group } from '../../../src/entities/assignments/group.entity';
import { Assignment } from '../../../src/entities/assignments/assignment.entity';
import { Student } from '../../../src/entities/users/student.entity';

export function makeTestGroups(em: EntityManager, students: Student[], assignments: Assignment[]): Group[] {
    /*
     * Group #1 for Assignment #1 in class 'id01'
     * => Assigned to do learning path 'id02'
     */
    group01 = em.create(Group, {
        assignment: assignments[0],
        groupNumber: 1,
        members: students.slice(0, 2),
    });

    /*
     * Group #2 for Assignment #1 in class 'id01'
     * => Assigned to do learning path 'id02'
     */
    group02 = em.create(Group, {
        assignment: assignments[0],
        groupNumber: 2,
        members: students.slice(2, 4),
    });

    /*
     * Group #3 for Assignment #1 in class 'id01'
     * => Assigned to do learning path 'id02'
     */
    group03 = em.create(Group, {
        assignment: assignments[0],
        groupNumber: 3,
        members: students.slice(4, 6),
    });

    /*
     * Group #4 for Assignment #2 in class 'id02'
     * => Assigned to do learning path 'id01'
     */
    group04 = em.create(Group, {
        assignment: assignments[1],
        groupNumber: 4,
        members: students.slice(3, 4),
    });

    /*
     * Group #5 for Assignment #4 in class 'id01'
     * => Assigned to do learning path 'id01'
     */
    group05 = em.create(Group, {
        assignment: assignments[3],
        groupNumber: 1,
        members: students.slice(0, 2),
    });

    return [group01, group02, group03, group04, group05];
}

let group01: Group;
let group02: Group;
let group03: Group;
let group04: Group;
let group05: Group;

export function getTestGroup01() {
    return group01;
}

export function getTestGroup02() {
    return group02;
}

export function getTestGroup03() {
    return group03;
}

export function getTestGroup04() {
    return group04;
}

export function getTestGroup05() {
    return group05;
}

