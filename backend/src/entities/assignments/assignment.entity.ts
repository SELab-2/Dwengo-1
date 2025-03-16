import { Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Class } from '../classes/class.entity.js';
import { Group } from './group.entity.js';
import { Language } from '../content/language.js';
import { AssignmentRepository } from '../../data/assignments/assignment-repository.js';

@Entity({
    repository: () => AssignmentRepository,
})
export class Assignment {
    @ManyToOne({
        entity: () => Class,
        primary: true,
    })
    within!: Class;

    @PrimaryKey({ type: 'number', autoincrement: true })
    id?: number;

    @Property({ type: 'string' })
    title!: string;

    @Property({ type: 'text' })
    description!: string;

    @Property({ type: 'string' })
    learningPathHruid!: string;

    @Enum({
        items: () => Language,
    })
    learningPathLanguage!: Language;

    @OneToMany({
        entity: () => Group,
        mappedBy: 'assignment',
    })
    groups!: Group[];
}
