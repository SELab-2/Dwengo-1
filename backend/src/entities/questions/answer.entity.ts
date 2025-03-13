import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Question } from './question.entity.js';
import { Teacher } from '../users/teacher.entity.js';
import { AnswerRepository } from '../../data/questions/answer-repository.js';

@Entity({
    repository: () => {
        return AnswerRepository;
    },
})
export class Answer {
    @ManyToOne({
        entity: () => {
            return Teacher;
        },
        primary: true,
    })
    author!: Teacher;

    @ManyToOne({
        entity: () => {
            return Question;
        },
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
