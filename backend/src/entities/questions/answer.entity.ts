import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Question } from './question.entity.js';
import { Teacher } from '../users/teacher.entity.js';

@Entity()
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

    @PrimaryKey({ type: 'integer' })
    sequenceNumber!: number;

    @Property({ type: 'datetime' })
    timestamp: Date = new Date();

    @Property({ type: 'text' })
    content!: string;
}
