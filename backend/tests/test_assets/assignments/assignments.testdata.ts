import { EntityManager } from '@mikro-orm/core';
import { Assignment } from '../../../src/entities/assignments/assignment.entity';
import { Language } from '@dwengo-1/common/util/language';
import { testLearningPath01, testLearningPath02, testLearningPathWithConditions } from '../content/learning-paths.testdata';
import { getClass01, getClass02, getClassWithTestleerlingAndTestleerkracht } from '../classes/classes.testdata';

export function makeTestAssignemnts(em: EntityManager): Assignment[] {
    assignment01 = em.create(Assignment, {
        id: 21000,
        within: getClass01(),
        title: 'dire straits',
        description: 'reading',
        learningPathHruid: testLearningPath02.hruid,
        learningPathLanguage: testLearningPath02.language as Language,
        groups: [],
    });

    assignment02 = em.create(Assignment, {
        id: 21001,
        within: getClass02(),
        title: 'tool',
        description: 'reading',
        learningPathHruid: testLearningPath01.hruid,
        learningPathLanguage: testLearningPath01.language as Language,
        groups: [],
    });

    assignment03 = em.create(Assignment, {
        id: 21002,
        within: getClass01(),
        title: 'delete',
        description: 'will be deleted',
        learningPathHruid: testLearningPath02.hruid,
        learningPathLanguage: testLearningPath02.language as Language,
        groups: [],
    });

    assignment04 = em.create(Assignment, {
        id: 21003,
        within: getClass01(),
        title: 'another assignment',
        description: 'with a description',
        learningPathHruid: testLearningPath01.hruid,
        learningPathLanguage: testLearningPath01.language as Language,
        groups: [],
    });

    conditionalPathAssignment = em.create(Assignment, {
        within: getClassWithTestleerlingAndTestleerkracht(),
        id: 21004,
        title: 'Assignment: Conditional Learning Path',
        description: 'You have to do the testing learning path with a condition.',
        learningPathHruid: testLearningPathWithConditions.hruid,
        learningPathLanguage: testLearningPathWithConditions.language as Language,
        groups: [],
    });

    return [assignment01, assignment02, assignment03, assignment04, conditionalPathAssignment];
}

let assignment01: Assignment;
let assignment02: Assignment;
let assignment03: Assignment;
let assignment04: Assignment;
let conditionalPathAssignment: Assignment;

export function getAssignment01(): Assignment {
    return assignment01;
}

export function getAssignment02(): Assignment {
    return assignment02;
}

export function getAssignment03(): Assignment {
    return assignment03;
}

export function getAssignment04(): Assignment {
    return assignment04;
}

export function getConditionalPathAssignment(): Assignment {
    return conditionalPathAssignment;
}
