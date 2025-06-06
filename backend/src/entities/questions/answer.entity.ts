import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Question } from './question.entity.js';
import { Teacher } from '../users/teacher.entity.js';
import { AnswerRepository } from '../../data/questions/answer-repository.js';

@Entity({ repository: () => AnswerRepository })
export class Answer {
    @ManyToOne({
        entity: () => Teacher,
        primary: true,
    })
    author!: Teacher;

    @ManyToOne({
        entity: () => Question,
        primary: true,
    })
    toQuestion!: Question;

    @PrimaryKey({ type: 'integer', autoincrement: true })
    sequenceNumber?: number;

    @Property({ type: 'datetime' })
    timestamp: Date = new Date();

    @Property({ type: 'text' })
    content!: string;
}
