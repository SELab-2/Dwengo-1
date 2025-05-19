import { EntityManager } from '@mikro-orm/core';
import { Group } from '../../../src/entities/assignments/group.entity';
import { getAssignment01, getAssignment02, getAssignment04, getConditionalPathAssignment } from './assignments.testdata';
import { getDireStraits, getNoordkaap, getPinkFloyd, getSmashingPumpkins, getTestleerling1, getTheDoors, getTool } from '../users/students.testdata';

export function makeTestGroups(em: EntityManager): Group[] {
    /*
     * Group #1 for Assignment #1 in class 'id01'
     * => Assigned to do learning path 'id02'
     */
    // Gets deleted
    group01 = em.create(Group, {
        assignment: getAssignment01(),
        groupNumber: 21001,
        members: [getNoordkaap(), getDireStraits()],
    });

    /*
     * Group #2 for Assignment #1 in class 'id01'
     * => Assigned to do learning path 'id02'
     */
    group02 = em.create(Group, {
        assignment: getAssignment01(),
        groupNumber: 21002,
        members: [getTool(), getSmashingPumpkins()],
    });

    /*
     * Group #3 for Assignment #1 in class 'id01'
     * => Assigned to do learning path 'id02'
     */
    group03 = em.create(Group, {
        assignment: getAssignment01(),
        groupNumber: 21003,
        members: [getPinkFloyd(), getTheDoors()],
    });

    /*
     * Group #4 for Assignment #2 in class 'id02'
     * => Assigned to do learning path 'id01'
     */
    group04 = em.create(Group, {
        assignment: getAssignment02(),
        groupNumber: 21004,
        members: getSmashingPumpkins(),
    });

    /*
     * Group #5 for Assignment #4 in class 'id01'
     * => Assigned to do learning path 'id01'
     */
    group05 = em.create(Group, {
        assignment: getAssignment04(),
        groupNumber: 21006,
        members: [getNoordkaap(), getDireStraits()],
    });

    /**
     * Group 1 for the assignment of the testing learning path with conditions.
     */
    group1ConditionalLearningPath = em.create(Group, {
        assignment: getConditionalPathAssignment(),
        groupNumber: 21005,
        members: [getTestleerling1()],
    });

    return [group01, group02, group03, group04, group05, group1ConditionalLearningPath];
}

let group01: Group;
let group02: Group;
let group03: Group;
let group04: Group;
let group05: Group;
let group1ConditionalLearningPath: Group;

export function getTestGroup01(): Group {
    return group01;
}

export function getTestGroup02(): Group {
    return group02;
}

export function getTestGroup03(): Group {
    return group03;
}

export function getTestGroup04(): Group {
    return group04;
}

export function getTestGroup05(): Group {
    return group05;
}

export function getGroup1ConditionalLearningPath(): Group {
    return group1ConditionalLearningPath;
}
