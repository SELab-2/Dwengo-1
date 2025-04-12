import { EntityManager } from '@mikro-orm/core';
import { Answer } from '../../../src/entities/questions/answer.entity';
import { Teacher } from '../../../src/entities/users/teacher.entity';
import { Question } from '../../../src/entities/questions/question.entity';

let answer01: Answer;
let answer02: Answer;
let answer03: Answer;

export let TEST_ANSWER_LIST: Answer[];

export function makeTestAnswers(em: EntityManager, teachers: Teacher[], questions: Question[]): Answer[] {
    answer01 = em.create(Answer, { author: teachers[0], toQuestion: questions[1], sequenceNumber: 1, timestamp: new Date(), content: 'answer' });
    answer02 = em.create(Answer, { author: teachers[0], toQuestion: questions[1], sequenceNumber: 2, timestamp: new Date(), content: 'answer2' });
    answer03 = em.create(Answer, { author: teachers[1], toQuestion: questions[3], sequenceNumber: 1, timestamp: new Date(), content: 'answer3' });

    TEST_ANSWER_LIST = [answer01, answer02, answer03];
    return TEST_ANSWER_LIST;
}
