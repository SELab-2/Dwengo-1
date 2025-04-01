import { EntityManager } from '@mikro-orm/core';
import { Language } from 'dwengo-1-common/src/util/language';
import { Submission } from '../../../src/entities/assignments/submission.entity';
import { Student } from '../../../src/entities/users/student.entity';
import { Group } from '../../../src/entities/assignments/group.entity';

export function makeTestSubmissions(em: EntityManager, students: Student[], groups: Group[]): Submission[] {
    const submission01 = em.create(Submission, {
        learningObjectHruid: 'id03',
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        submissionNumber: 1,
        submitter: students[0],
        submissionTime: new Date(2025, 2, 20),
        onBehalfOf: groups[0],
        content: 'sub1',
    });

    const submission02 = em.create(Submission, {
        learningObjectHruid: 'id03',
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        submissionNumber: 2,
        submitter: students[0],
        submissionTime: new Date(2025, 2, 25),
        onBehalfOf: groups[0],
        content: '',
    });

    const submission03 = em.create(Submission, {
        learningObjectHruid: 'id02',
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        submissionNumber: 1,
        submitter: students[0],
        submissionTime: new Date(2025, 2, 20),
        content: '',
    });

    const submission04 = em.create(Submission, {
        learningObjectHruid: 'id02',
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        submissionNumber: 2,
        submitter: students[0],
        submissionTime: new Date(2025, 2, 25),
        content: '',
    });

    const submission05 = em.create(Submission, {
        learningObjectHruid: 'id01',
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        submissionNumber: 1,
        submitter: students[1],
        submissionTime: new Date(2025, 2, 20),
        content: '',
    });

    return [submission01, submission02, submission03, submission04, submission05];
}
