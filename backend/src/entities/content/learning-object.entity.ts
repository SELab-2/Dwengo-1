import { Embedded, Entity, Enum, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Language } from './language.js';
import { Attachment } from './attachment.entity.js';
import { Teacher } from '../users/teacher.entity.js';
import { DwengoContentType } from '../../services/learning-objects/processing/content-type.js';
import { v4 } from 'uuid';
import { LearningObjectRepository } from '../../data/content/learning-object-repository.js';
import { EducationalGoal } from './educational-goal.entity.js';
import { ReturnValue } from './return-value.entity.js';

@Entity({ repository: () => LearningObjectRepository })
export class LearningObject {
    @PrimaryKey({ type: 'string' })
    hruid!: string;

    @Enum({
        items: () => Language,
        primary: true,
    })
    language!: Language;

    @PrimaryKey({ type: 'number' })
    version: number = 1;

    @Property({ type: 'uuid', unique: true })
    uuid = v4();

    @ManyToMany({
        entity: () => Teacher,
    })
    admins!: Teacher[];

    @Property({ type: 'string' })
    title!: string;

    @Property({ type: 'text' })
    description!: string;

    @Property({ type: 'string' })
    contentType!: DwengoContentType;

    @Property({ type: 'array' })
    keywords: string[] = [];

    @Property({ type: 'array', nullable: true })
    targetAges?: number[] = [];

    @Property({ type: 'bool' })
    teacherExclusive: boolean = false;

    @Property({ type: 'array' })
    skosConcepts: string[] = [];

    @Embedded({
        entity: () => EducationalGoal,
        array: true,
    })
    educationalGoals: EducationalGoal[] = [];

    @Property({ type: 'string' })
    copyright: string = '';

    @Property({ type: 'string' })
    license: string = '';

    @Property({ type: 'smallint', nullable: true })
    difficulty?: number;

    @Property({ type: 'integer', nullable: true })
    estimatedTime?: number;

    @Embedded({
        entity: () => ReturnValue,
    })
    returnValue!: ReturnValue;

    @Property({ type: 'bool' })
    available: boolean = true;

    @Property({ type: 'string', nullable: true })
    contentLocation?: string;

    @OneToMany({
        entity: () => Attachment,
        mappedBy: 'learningObject',
    })
    attachments: Attachment[] = [];

    @Property({ type: 'blob' })
    content!: Buffer;
}
