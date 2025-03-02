import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Question } from './question.entity';
import { Teacher } from '../users/teacher.entity';

@Entity()
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

    @PrimaryKey({ type: 'integer' })
    sequenceNumber!: number;

    @Property({ type: 'datetime' })
    timestamp: Date = new Date();

    @Property({ type: 'text' })
    content!: string;
}
