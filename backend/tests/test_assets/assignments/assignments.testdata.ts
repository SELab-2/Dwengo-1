import { EntityManager } from '@mikro-orm/core';
import { Assignment } from '../../../src/entities/assignments/assignment.entity';
import { Class } from '../../../src/entities/classes/class.entity';
import { Language } from '@dwengo-1/common/util/language';
import { testLearningPathWithConditions } from '../content/learning-paths.testdata';
import { getClassWithTestleerlingAndTestleerkracht } from '../classes/classes.testdata';

export function makeTestAssignemnts(em: EntityManager, classes: Class[]): Assignment[] {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7);
    const today = new Date();
    today.setHours(23, 59);
    assignment01 = em.create(Assignment, {
        id: 21000,
        within: classes[0],
        title: 'dire straits',
        description: 'reading',
        learningPathHruid: 'un_ai',
        learningPathLanguage: Language.English,
        deadline: today,
        groups: [],
    });

    assignment02 = em.create(Assignment, {
        id: 21001,
        within: classes[1],
        title: 'tool',
        description: 'reading',
        learningPathHruid: 'id01',
        learningPathLanguage: Language.English,
        deadline: futureDate,
        groups: [],
    });

    assignment03 = em.create(Assignment, {
        id: 21002,
        within: classes[0],
        title: 'delete',
        description: 'will be deleted',
        learningPathHruid: 'id02',
        learningPathLanguage: Language.English,
        deadline: pastDate,
        groups: [],
    });

    assignment04 = em.create(Assignment, {
        id: 21003,
        within: classes[0],
        title: 'another assignment',
        description: 'with a description',
        learningPathHruid: 'id01',
        learningPathLanguage: Language.English,
        deadline: pastDate,
        groups: [],
    });

    conditionalPathAssignment = em.create(Assignment, {
        within: getClassWithTestleerlingAndTestleerkracht(),
        id: 21004,
        title: 'Assignment: Conditional Learning Path',
        description: 'You have to do the testing learning path with a condition.',
        learningPathHruid: testLearningPathWithConditions.hruid,
        learningPathLanguage: testLearningPathWithConditions.language as Language,
        deadline: futureDate,
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
