import { Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Class } from '../classes/class.entity.js';
import { Group } from './group.entity.js';
import { Language } from '@dwengo-1/common/util/language';
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

    @PrimaryKey({ type: 'integer', autoincrement: true })
    id?: number;

    @Property({ type: 'string' })
    title!: string;

    @Property({ type: 'text' })
    description!: string;

    @Property({ type: 'string' })
    learningPathHruid!: string;

    @Property({ type: 'datetime', nullable: true })
    deadline?: Date;

    @Enum({
        items: () => Language,
    })
    learningPathLanguage!: Language;

    @OneToMany({
        entity: () => Group,
        mappedBy: 'assignment',
        cascade: [Cascade.ALL],
    })
    groups: Collection<Group> = new Collection<Group>(this);
}
