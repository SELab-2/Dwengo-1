import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Question } from '../../../src/entities/questions/question.entity';
import { Language } from '../../../src/entities/content/language';
import { Student } from '../../../src/entities/users/student.entity';

export function makeTestQuestions(em: EntityManager<IDatabaseDriver<Connection>>, students: Array<Student>): Array<Question> {
    const question01 = em.create(Question, {
        learningObjectLanguage: Language.English,
        learningObjectVersion: '1',
        learningObjectHruid: 'id05',
        sequenceNumber: 1,
        author: students[0],
        timestamp: new Date(),
        content: 'question',
    });

    const question02 = em.create(Question, {
        learningObjectLanguage: Language.English,
        learningObjectVersion: '1',
        learningObjectHruid: 'id05',
        sequenceNumber: 2,
        author: students[2],
        timestamp: new Date(),
        content: 'question',
    });

    const question03 = em.create(Question, {
        learningObjectLanguage: Language.English,
        learningObjectVersion: '1',
        learningObjectHruid: 'id04',
        sequenceNumber: 1,
        author: students[0],
        timestamp: new Date(),
        content: 'question',
    });

    const question04 = em.create(Question, {
        learningObjectLanguage: Language.English,
        learningObjectVersion: '1',
        learningObjectHruid: 'id01',
        sequenceNumber: 1,
        author: students[1],
        timestamp: new Date(),
        content: 'question',
    });

    return [question01, question02, question03, question04];
}
