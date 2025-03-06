import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Language } from '../content/language.js';
import { Student } from '../users/student.entity.js';

@Entity()
export class Question {
    @PrimaryKey({ type: 'string' })
    learningObjectHruid!: string;

    @Enum({
        items: () => {
            return Language;
        },
        primary: true,
    })
    learningObjectLanguage!: Language;

    @PrimaryKey({ type: 'string' })
    learningObjectVersion: string = '1';

    @PrimaryKey({ type: 'integer' })
    sequenceNumber!: number;

    @ManyToOne({
        entity: () => {
            return Student;
        },
    })
    author!: Student;

    @Property({ type: 'datetime' })
    timestamp: Date = new Date();

    @Property({ type: 'text' })
    content!: string;
}
