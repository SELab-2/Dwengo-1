import { EntityManager } from '@mikro-orm/core';
import { Answer } from '../../../src/entities/questions/answer.entity';
import { Teacher } from '../../../src/entities/users/teacher.entity';
import { Question } from '../../../src/entities/questions/question.entity';
import { getTestleerling1 } from '../users/students.testdata';
import { getTestleerkracht1 } from '../users/teachers.testdata';
import { getQuestion07 } from './questions.testdata';

export function makeTestAnswers(em: EntityManager, teachers: Teacher[], questions: Question[]): Answer[] {
    const answer01 = em.create(Answer, {
        author: teachers[0],
        toQuestion: questions[1],
        sequenceNumber: 1,
        timestamp: new Date(),
        content: 'answer',
    });

    const answer02 = em.create(Answer, {
        author: teachers[0],
        toQuestion: questions[1],
        sequenceNumber: 2,
        timestamp: new Date(),
        content: 'answer2',
    });

    const answer03 = em.create(Answer, {
        author: teachers[1],
        toQuestion: questions[3],
        sequenceNumber: 1,
        timestamp: new Date(),
        content: 'answer3',
    });

    const answer04 = em.create(Answer, {
        author: getTestleerkracht1(),
        toQuestion: getQuestion07(),
        sequenceNumber: 1,
        timestamp: new Date(),
        content: 'this is a test answer',
    });

    const answer05 = em.create(Answer, {
        author: getTestleerkracht1(),
        toQuestion: getQuestion07(),
        sequenceNumber: 2,
        timestamp: new Date(),
        content: 'this is a test answer',
    });

    return [answer01, answer02, answer03, answer04, answer05];
}
