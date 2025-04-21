import { EntityManager } from '@mikro-orm/core';
import { Question } from '../../../src/entities/questions/question.entity';
import { Language } from '@dwengo-1/common/util/language';
import { Student } from '../../../src/entities/users/student.entity';
import { Group } from '../../../src/entities/assignments/group.entity';
import { getTestleerling1 } from '../users/students.testdata';
import { testLearningObjectMultipleChoice } from '../content/learning-objects.testdata';
import { getGroup1ConditionalLearningPath } from '../assignments/groups.testdata';

export function makeTestQuestions(em: EntityManager, students: Student[], groups: Group[]): Question[] {
    const question01 = em.create(Question, {
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        learningObjectHruid: 'id05',
        inGroup: groups[0], // Group #1 for Assignment #1 in class 'id01'
        sequenceNumber: 1,
        author: students[0],
        timestamp: new Date(),
        content: 'question',
    });

    const question02 = em.create(Question, {
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        learningObjectHruid: 'id05',
        inGroup: groups[0], // Group #1 for Assignment #1 in class 'id01'
        sequenceNumber: 2,
        author: students[2],
        timestamp: new Date(),
        content: 'question',
    });

    const question03 = em.create(Question, {
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        learningObjectHruid: 'id04',
        sequenceNumber: 1,
        author: students[0],
        inGroup: groups[0], // Group #1 for Assignment #1 in class 'id01'
        timestamp: new Date(),
        content: 'question',
    });

    const question04 = em.create(Question, {
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        learningObjectHruid: 'id01',
        sequenceNumber: 1,
        author: students[1],
        inGroup: groups[1], // Group #2 for Assignment #1 in class 'id01'
        timestamp: new Date(),
        content: 'question',
    });

    const question05 = em.create(Question, {
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        learningObjectHruid: 'id05',
        sequenceNumber: 3,
        author: students[1],
        inGroup: groups[1], // Group #2 for Assignment #1 in class 'id01'
        timestamp: new Date(),
        content: 'question',
    });

    const question06 = em.create(Question, {
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        learningObjectHruid: 'id05',
        sequenceNumber: 4,
        author: students[2],
        inGroup: groups[5], // Group #4 for Assignment #2 in class 'id02'
        timestamp: new Date(),
        content: 'question',
    });
    
    question07 = em.create(Question, {
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        learningObjectHruid: testLearningObjectMultipleChoice.hruid,
        sequenceNumber: 1,
        author: getTestleerling1(),
        inGroup: getGroup1ConditionalLearningPath(),
        timestamp: new Date(),
        content: 'this is a test question',
    });

    question08 = em.create(Question, {
        learningObjectLanguage: Language.English,
        learningObjectVersion: 1,
        learningObjectHruid: testLearningObjectMultipleChoice.hruid,
        sequenceNumber: 2,
        author: getTestleerling1(),
        inGroup: getGroup1ConditionalLearningPath(),
        timestamp: new Date(),
        content: 'this is a second test question'
    });

    return [question01, question02, question03, question04, question05, question06, question07, question08];
}

let question08: Question;
let question07: Question;

export function getQuestion07(): Question {
    return question07;
}

export function getQuestion08(): Question {
    return question08;
}