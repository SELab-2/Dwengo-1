import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Language } from '../content/language.js';
import { Student } from '../users/student.entity.js';
import { QuestionRepository } from '../../data/questions/question-repository.js';

@Entity({ repository: () => QuestionRepository })
export class Question {
    @PrimaryKey({ type: 'string' })
    learningObjectHruid!: string;

    @Enum({
        items: () => Language,
        primary: true,
    })
    learningObjectLanguage!: Language;

    @PrimaryKey({ type: 'number' })
    learningObjectVersion = 1;

    @PrimaryKey({ type: 'integer', autoincrement: true })
    sequenceNumber?: number;

    @ManyToOne({
        entity: () => Student,
    })
    author!: Student;

    @Property({ type: 'datetime' })
    timestamp: Date = new Date();

    @Property({ type: 'text' })
    content!: string;
}
