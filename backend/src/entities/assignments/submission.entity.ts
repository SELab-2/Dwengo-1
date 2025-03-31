import { Student } from '../users/student.entity.js';
import { Group } from './group.entity.js';
import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { SubmissionRepository } from '../../data/assignments/submission-repository.js';
import { Language } from 'dwengo-1-common/src/util/language.js';

@Entity({ repository: () => SubmissionRepository })
export class Submission {
    @PrimaryKey({ type: 'string' })
    learningObjectHruid!: string;

    @Enum({
        items: () => Language,
        primary: true,
    })
    learningObjectLanguage!: Language;

    @PrimaryKey({ type: 'numeric' })
    learningObjectVersion: number = 1;

    @PrimaryKey({ type: 'integer', autoincrement: true })
    submissionNumber?: number;

    @ManyToOne({
        entity: () => Student,
    })
    submitter!: Student;

    @Property({ type: 'datetime' })
    submissionTime!: Date;

    @ManyToOne({
        entity: () => Group,
        nullable: true,
    })
    onBehalfOf?: Group;

    @Property({ type: 'json' })
    content!: string;
}
