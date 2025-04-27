import { EntityManager } from '@mikro-orm/core';
import { Question } from '../../../src/entities/questions/question.entity';
import { Student } from '../../../src/entities/users/student.entity';
import { Group } from '../../../src/entities/assignments/group.entity';
import { getDireStraits, getNoordkaap, getTestleerling1, getTool } from '../users/students.testdata';
import { testLearningObject01, testLearningObject04, testLearningObject05, testLearningObjectMultipleChoice } from '../content/learning-objects.testdata';
import { getGroup1ConditionalLearningPath, getTestGroup01, getTestGroup02 } from '../assignments/groups.testdata';

export function makeTestQuestions(em: EntityManager, students: Student[], groups: Group[]): Question[] {
    question01 = em.create(Question, {
        learningObjectLanguage: testLearningObject05.language,
        learningObjectVersion: testLearningObject05.version,
        learningObjectHruid: testLearningObject05.hruid,
        inGroup: getTestGroup01(), // Group #1 for Assignment #1 in class 'id01'
        sequenceNumber: 1,
        author: getNoordkaap(),
        timestamp: new Date(),
        content: 'question',
    });

    question02 = em.create(Question, {
        learningObjectLanguage: testLearningObject05.language,
        learningObjectVersion: testLearningObject05.version,
        learningObjectHruid: testLearningObject05.hruid,
        inGroup: getTestGroup01(), // Group #1 for Assignment #1 in class 'id01'
        sequenceNumber: 2,
        author: getTool(),
        timestamp: new Date(),
        content: 'question',
    });

    question03 = em.create(Question, {
        learningObjectLanguage: testLearningObject04.language,
        learningObjectVersion: testLearningObject04.version,
        learningObjectHruid: testLearningObject04.hruid,
        sequenceNumber: 1,
        author: getNoordkaap(),
        inGroup: getTestGroup01(), // Group #1 for Assignment #1 in class 'id01'
        timestamp: new Date(),
        content: 'question',
    });

    question04 = em.create(Question, {
        learningObjectLanguage: testLearningObject01.language,
        learningObjectVersion: testLearningObject01.version,
        learningObjectHruid: testLearningObject01.hruid,
        sequenceNumber: 1,
        author: getDireStraits(),
        inGroup: getTestGroup02(), // Group #2 for Assignment #1 in class 'id01'
        timestamp: new Date(),
        content: 'question',
    });

    question05 = em.create(Question, {
        learningObjectLanguage: testLearningObject05.language,
        learningObjectVersion: testLearningObject05.version,
        learningObjectHruid: testLearningObject05.hruid,
        sequenceNumber: 3,
        author: getDireStraits(),
        inGroup: getTestGroup02(), // Group #2 for Assignment #1 in class 'id01'
        timestamp: new Date(),
        content: 'question',
    });

    question06 = em.create(Question, {
        learningObjectLanguage: testLearningObject05.language,
        learningObjectVersion: testLearningObject05.version,
        learningObjectHruid: testLearningObject05.hruid,
        sequenceNumber: 4,
        author: getTool(),
        inGroup: getGroup1ConditionalLearningPath(), // Group #4 for Assignment #2 in class 'id02'
        timestamp: new Date(),
        content: 'question',
    });

    question07 = em.create(Question, {
        learningObjectLanguage: testLearningObjectMultipleChoice.language,
        learningObjectVersion: testLearningObjectMultipleChoice.version,
        learningObjectHruid: testLearningObjectMultipleChoice.hruid,
        sequenceNumber: 1,
        author: getTestleerling1(),
        inGroup: getGroup1ConditionalLearningPath(),
        timestamp: new Date(),
        content: 'this is a test question',
    });

    question08 = em.create(Question, {
        learningObjectLanguage: testLearningObjectMultipleChoice.language,
        learningObjectVersion: testLearningObjectMultipleChoice.version,
        learningObjectHruid: testLearningObjectMultipleChoice.hruid,
        sequenceNumber: 2,
        author: getTestleerling1(),
        inGroup: getGroup1ConditionalLearningPath(),
        timestamp: new Date(),
        content: 'this is a second test question',
    });

    return [question01, question02, question03, question04, question05, question06, question07, question08];
}

let question01: Question;
let question02: Question;
let question03: Question;
let question04: Question;
let question05: Question;
let question06: Question;
let question07: Question;
let question08: Question;

export function getQuestion01(): Question {
    return question01;
}

export function getQuestion02(): Question {
    return question02;
}

export function getQuestion03(): Question {
    return question03;
}

export function getQuestion04(): Question {
    return question04;
}

export function getQuestion05(): Question {
    return question05;
}

export function getQuestion06(): Question {
    return question06;
}


export function getQuestion07(): Question {
    return question07;
}

export function getQuestion08(): Question {
    return question08;
}
