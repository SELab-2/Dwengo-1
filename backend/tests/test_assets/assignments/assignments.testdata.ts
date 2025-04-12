import { EntityManager } from '@mikro-orm/core';
import { Assignment } from '../../../src/entities/assignments/assignment.entity';
import { Class } from '../../../src/entities/classes/class.entity';
import { Language } from '@dwengo-1/common/util/language';

let assignment01: Assignment;
let assignment02: Assignment;
let assignment03: Assignment;
let assignment04: Assignment;

export let TEST_ASSIGNMENT_LIST: Assignment[];

export function makeTestAssignments(em: EntityManager, classes: Class[]): Assignment[] {
    assignment01 = em.create(Assignment, {
        within: classes[0],
        id: 1,
        title: 'dire straits',
        description: 'reading',
        learningPathHruid: 'id02',
        learningPathLanguage: Language.English,
        groups: [],
    });

    assignment02 = em.create(Assignment, {
        within: classes[1],
        id: 2,
        title: 'tool',
        description: 'reading',
        learningPathHruid: 'id01',
        learningPathLanguage: Language.English,
        groups: [],
    });

    assignment03 = em.create(Assignment, {
        within: classes[0],
        id: 3,
        title: 'delete',
        description: 'will be deleted',
        learningPathHruid: 'id02',
        learningPathLanguage: Language.English,
        groups: [],
    });

    assignment04 = em.create(Assignment, {
        within: classes[0],
        id: 4,
        title: 'another assignment',
        description: 'with a description',
        learningPathHruid: 'id01',
        learningPathLanguage: Language.English,
        groups: [],
    });

    TEST_ASSIGNMENT_LIST = [assignment01, assignment02, assignment03, assignment04];
    return TEST_ASSIGNMENT_LIST;
}
