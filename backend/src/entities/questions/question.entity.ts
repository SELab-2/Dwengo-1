import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Student } from '../users/student.entity.js';
import { QuestionRepository } from '../../data/questions/question-repository.js';
import { Language } from '@dwengo-1/common/util/language';
import { Group } from '../assignments/group.entity.js';

@Entity({ repository: () => QuestionRepository })
export class Question {
    @PrimaryKey({ type: 'integer', autoincrement: true })
    sequenceNumber?: number;

    @PrimaryKey({ type: 'string' })
    learningObjectHruid!: string;

    @Enum({
        items: () => Language,
        primary: true,
    })
    learningObjectLanguage!: Language;

    @PrimaryKey({ type: 'number' })
    learningObjectVersion = 1;

    @ManyToOne({ entity: () => Group })
    inGroup!: Group;

    @ManyToOne({
        entity: () => Student,
    })
    author!: Student;

    @Property({ type: 'datetime' })
    timestamp: Date = new Date();

    @Property({ type: 'text' })
    content!: string;
}
