import { EntityManager } from '@mikro-orm/core';
import { Submission } from '../../../src/entities/assignments/submission.entity';
import { testLearningObject01, testLearningObject02, testLearningObject03 } from '../content/learning-objects.testdata';
import { getDireStraits, getNoordkaap, getSmashingPumpkins } from '../users/students.testdata';
import { getTestGroup01, getTestGroup02, getTestGroup04, getTestGroup05 } from './groups.testdata';

export function makeTestSubmissions(em: EntityManager): Submission[] {
    submission01 = em.create(Submission, {
        learningObjectHruid: testLearningObject03.hruid,
        learningObjectLanguage: testLearningObject03.language,
        learningObjectVersion: testLearningObject03.version,
        submissionNumber: 1,
        submitter: getNoordkaap(),
        submissionTime: new Date(2025, 2, 20),
        onBehalfOf: getTestGroup01(), // Group #1 for Assignment #1 in class 'id01'
        content: 'sub1',
    });

    submission02 = em.create(Submission, {
        learningObjectHruid: testLearningObject03.hruid,
        learningObjectLanguage: testLearningObject03.language,
        learningObjectVersion: testLearningObject03.version,
        submissionNumber: 2,
        submitter: getNoordkaap(),
        submissionTime: new Date(2025, 2, 25),
        onBehalfOf: getTestGroup01(), // Group #1 for Assignment #1 in class 'id01'
        content: '',
    });

    submission03 = em.create(Submission, {
        learningObjectHruid: testLearningObject02.hruid,
        learningObjectLanguage: testLearningObject02.language,
        learningObjectVersion: testLearningObject02.version,
        submissionNumber: 1,
        submitter: getNoordkaap(),
        submissionTime: new Date(2025, 2, 20),
        onBehalfOf: getTestGroup01(), // Group #1 for Assignment #1 in class 'id01'
        content: '',
    });

    submission04 = em.create(Submission, {
        learningObjectHruid: testLearningObject02.hruid,
        learningObjectLanguage: testLearningObject02.language,
        learningObjectVersion: testLearningObject02.version,
        submissionNumber: 2,
        submitter: getNoordkaap(),
        submissionTime: new Date(2025, 2, 25),
        onBehalfOf: getTestGroup01(), // Group #1 for Assignment #1 in class 'id01'
        content: '',
    });

    submission05 = em.create(Submission, {
        learningObjectHruid: testLearningObject01.hruid,
        learningObjectLanguage: testLearningObject01.language,
        learningObjectVersion: testLearningObject01.version,
        submissionNumber: 1,
        submitter: getDireStraits(),
        submissionTime: new Date(2025, 2, 20),
        onBehalfOf: getTestGroup02(), // Group #2 for Assignment #1 in class 'id01'
        content: '',
    });

    submission06 = em.create(Submission, {
        learningObjectHruid: testLearningObject01.hruid,
        learningObjectLanguage: testLearningObject01.language,
        learningObjectVersion: testLearningObject01.version,
        submissionNumber: 2,
        submitter: getDireStraits(),
        submissionTime: new Date(2025, 2, 25),
        onBehalfOf: getTestGroup05(), // Group #5 for Assignment #4 in class 'id01'
        content: '',
    });

    submission07 = em.create(Submission, {
        learningObjectHruid: testLearningObject01.hruid,
        learningObjectLanguage: testLearningObject01.language,
        learningObjectVersion: testLearningObject01.version,
        submissionNumber: 3,
        submitter: getSmashingPumpkins(),
        submissionTime: new Date(2025, 3, 25),
        onBehalfOf: getTestGroup04(), // Group #4 for Assignment #2 in class 'id02'
        content: '',
    });

    submission08 = em.create(Submission, {
        learningObjectHruid: testLearningObject02.hruid,
        learningObjectLanguage: testLearningObject02.language,
        learningObjectVersion: testLearningObject02.version,
        submissionNumber: 3,
        submitter: getDireStraits(),
        submissionTime: new Date(2025, 4, 7),
        onBehalfOf: getTestGroup02(), // Group #2 for Assignment #1 in class 'id01'
        content: '',
    });

    return [submission01, submission02, submission03, submission04, submission05, submission06, submission07, submission08];
}

let submission01: Submission;
let submission02: Submission;
let submission03: Submission;
let submission04: Submission;
let submission05: Submission;
let submission06: Submission;
let submission07: Submission;
let submission08: Submission;

export function getSubmission01(): Submission{
    return submission01;
}

export function getSubmission02(): Submission{
    return submission02;
}

export function getSubmission03(): Submission{
    return submission03;
}

export function getSubmission04(): Submission{
    return submission04;
}

export function getSubmission05(): Submission{
    return submission05;
}

export function getSubmission06(): Submission{
    return submission06;
}

export function getSubmission07(): Submission{
    return submission07;
}

export function getSubmission08(): Submission{
    return submission08;
}