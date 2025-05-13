import { EntityManager } from '@mikro-orm/core';
import { Answer } from '../../../src/entities/questions/answer.entity';
import { getFooFighters, getLimpBizkit, getTestleerkracht1 } from '../users/teachers.testdata';
import { getQuestion02, getQuestion04, getQuestion07 } from './questions.testdata';

export function makeTestAnswers(em: EntityManager): Answer[] {
    answer01 = em.create(Answer, {
        author: getFooFighters(),
        toQuestion: getQuestion02(),
        sequenceNumber: 1,
        timestamp: new Date(),
        content: 'answer',
    });

    answer02 = em.create(Answer, {
        author: getFooFighters(),
        toQuestion: getQuestion02(),
        sequenceNumber: 2,
        timestamp: new Date(),
        content: 'answer2',
    });

    // Gets deleted
    answer03 = em.create(Answer, {
        author: getLimpBizkit(),
        toQuestion: getQuestion04(),
        sequenceNumber: 1,
        timestamp: new Date(),
        content: 'answer3',
    });

    answer04 = em.create(Answer, {
        author: getTestleerkracht1(),
        toQuestion: getQuestion07(),
        sequenceNumber: 1,
        timestamp: new Date(),
        content: 'this is a test answer',
    });

    answer05 = em.create(Answer, {
        author: getTestleerkracht1(),
        toQuestion: getQuestion07(),
        sequenceNumber: 2,
        timestamp: new Date(),
        content: 'this is a test answer',
    });

    return [answer01, answer02, answer03, answer04, answer05];
}

let answer01: Answer;
let answer02: Answer;
let answer03: Answer;
let answer04: Answer;
let answer05: Answer;

export function getAnswer01(): Answer {
    return answer01;
}

export function getAnswer02(): Answer {
    return answer02;
}

export function getAnswer03(): Answer {
    return answer03;
}

export function getAnswer04(): Answer {
    return answer04;
}

export function getAnswer05(): Answer {
    return answer05;
}