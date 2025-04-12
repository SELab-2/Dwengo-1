import { EntityManager } from '@mikro-orm/core';
import { Question } from '../../../src/entities/questions/question.entity';
import { Language } from '@dwengo-1/common/util/language';
import { Student } from '../../../src/entities/users/student.entity';
import { Group } from '../../../src/entities/assignments/group.entity';

let question01: Question;
let question02: Question;
let question03: Question;
let question04: Question;
let question05: Question;
let question06: Question;

export let TEST_QUESTION_LIST: Question[];

export function makeTestQuestions(em: EntityManager, students: Student[], groups: Group[]): Question[] {
    // Group #1 for Assignment #1 in class 'id01'
    question01 = em.create(Question, { learningObjectLanguage: Language.English, learningObjectVersion: 1, learningObjectHruid: 'id05', inGroup: groups[0], sequenceNumber: 1, author: students[0], timestamp: new Date(), content: 'question' });
    // Group #1 for Assignment #1 in class 'id01'
    question02 = em.create(Question, { learningObjectLanguage: Language.English, learningObjectVersion: 1, learningObjectHruid: 'id05', inGroup: groups[0], sequenceNumber: 2, author: students[2], timestamp: new Date(), content: 'question' });
    // Group #1 for Assignment #1 in class 'id01'
    question03 = em.create(Question, { learningObjectLanguage: Language.English, learningObjectVersion: 1, learningObjectHruid: 'id04', inGroup: groups[0], sequenceNumber: 1, author: students[0], timestamp: new Date(), content: 'question' });
    // Group #2 for Assignment #1 in class 'id01'
    question04 = em.create(Question, { learningObjectLanguage: Language.English, learningObjectVersion: 1, learningObjectHruid: 'id01', inGroup: groups[1], sequenceNumber: 1, author: students[1], timestamp: new Date(), content: 'question' });
    // Group #2 for Assignment #1 in class 'id01'
    question05 = em.create(Question, { learningObjectLanguage: Language.English, learningObjectVersion: 1, learningObjectHruid: 'id05', inGroup: groups[1], sequenceNumber: 3, author: students[1], timestamp: new Date(), content: 'question' });
    // Group #4 for Assignment #2 in class 'id02'
    question06 = em.create(Question, { learningObjectLanguage: Language.English, learningObjectVersion: 1, learningObjectHruid: 'id05', inGroup: groups[3], sequenceNumber: 4, author: students[2], timestamp: new Date(), content: 'question' });

    TEST_QUESTION_LIST = [question01, question02, question03, question04, question05, question06];
    return TEST_QUESTION_LIST;
}
