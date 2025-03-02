import { Student } from '../users/student.entity.js';
import { Group } from './group.entity.js';
import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Language } from '../content/language.js';

@Entity()
export class Submission {
    @PrimaryKey({ type: 'string' })
    learningObjectHruid!: string;

    @Enum({ items: () => {return Language}, primary: true })
    learningObjectLanguage!: Language;

    @PrimaryKey({ type: 'string' })
    learningObjectVersion: string = '1';

    @PrimaryKey({ type: 'integer' })
    submissionNumber!: number;

    @ManyToOne({ entity: () => {return Student} })
    submitter!: Student;

    @Property({ type: 'datetime' })
    submissionTime!: Date;

    @ManyToOne({ entity: () => {return Group}, nullable: true })
    onBehalfOf?: Group;

    @Property({ type: 'json' })
    content!: string;
}
