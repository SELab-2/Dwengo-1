import { EntityManager } from '@mikro-orm/core';
import { Submission } from '../../../src/entities/assignments/submission.entity';
import { Language } from '@dwengo-1/common/util/language';
import { Student } from '../../../src/entities/users/student.entity';
import { Group } from '../../../src/entities/assignments/group.entity';

let submission01: Submission;
let submission02: Submission;
let submission03: Submission;
let submission04: Submission;
let submission05: Submission;
let submission06: Submission;
let submission07: Submission;
let submission08: Submission;

export let TEST_SUBMISSION_LIST: Submission[];

export function makeTestSubmissions(em: EntityManager, students: Student[], groups: Group[]): Submission[] {
    // Group #1 for Assignment #1 in class 'id01'
    submission01 = em.create(Submission, { learningObjectHruid: 'id03', learningObjectLanguage: Language.English, learningObjectVersion: 1, submissionNumber: 1, submitter: students[0], submissionTime: new Date(2025, 2, 20), onBehalfOf: groups[0], content: 'sub1' });
    // Group #1 for Assignment #1 in class 'id01'
    submission02 = em.create(Submission, { learningObjectHruid: 'id03', learningObjectLanguage: Language.English, learningObjectVersion: 1, submissionNumber: 2, submitter: students[0], submissionTime: new Date(2025, 2, 25), onBehalfOf: groups[0], content: '' });
    // Group #1 for Assignment #1 in class 'id01'
    submission03 = em.create(Submission, { learningObjectHruid: 'id02', learningObjectLanguage: Language.English, learningObjectVersion: 1, submissionNumber: 1, submitter: students[0], submissionTime: new Date(2025, 2, 20), onBehalfOf: groups[0], content: '' });
    // Group #1 for Assignment #1 in class 'id01'
    submission04 = em.create(Submission, { learningObjectHruid: 'id02', learningObjectLanguage: Language.English, learningObjectVersion: 1, submissionNumber: 2, submitter: students[0], submissionTime: new Date(2025, 2, 25), onBehalfOf: groups[0], content: '' });
    // Group #2 for Assignment #1 in class 'id01'
    submission05 = em.create(Submission, { learningObjectHruid: 'id01', learningObjectLanguage: Language.English, learningObjectVersion: 1, submissionNumber: 1, submitter: students[1], submissionTime: new Date(2025, 2, 20), onBehalfOf: groups[1], content: '' });
    // Group #5 for Assignment #4 in class 'id01'
    submission06 = em.create(Submission, { learningObjectHruid: 'id01', learningObjectLanguage: Language.English, learningObjectVersion: 1, submissionNumber: 2, submitter: students[1], submissionTime: new Date(2025, 2, 25), onBehalfOf: groups[4], content: '' });
    // Group #4 for Assignment #2 in class 'id02'
    submission07 = em.create(Submission, { learningObjectHruid: 'id01', learningObjectLanguage: Language.English, learningObjectVersion: 1, submissionNumber: 3, submitter: students[3], submissionTime: new Date(2025, 3, 25), onBehalfOf: groups[3], content: '' });
    // Group #2 for Assignment #1 in class 'id01'
    submission08 = em.create(Submission, { learningObjectHruid: 'id02', learningObjectLanguage: Language.English, learningObjectVersion: 1, submissionNumber: 3, submitter: students[1], submissionTime: new Date(2025, 4, 7), onBehalfOf: groups[1], content: '' });

    TEST_SUBMISSION_LIST = [submission01, submission02, submission03, submission04, submission05, submission06, submission07, submission08];
    return TEST_SUBMISSION_LIST;
}
