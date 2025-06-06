import { ArrayType, Collection, Embedded, Entity, Enum, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Attachment } from './attachment.entity.js';
import { Teacher } from '../users/teacher.entity.js';
import { DwengoContentType } from '../../services/learning-objects/processing/content-type.js';
import { v4 } from 'uuid';
import { LearningObjectRepository } from '../../data/content/learning-object-repository.js';
import { EducationalGoal } from './educational-goal.entity.js';
import { ReturnValue } from './return-value.entity.js';
import { Language } from '@dwengo-1/common/util/language';

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
    version = 1;

    @Property({ type: 'uuid', unique: true })
    uuid = v4();

    @ManyToMany({
        entity: () => Teacher,
    })
    admins: Collection<Teacher> = new Collection<Teacher>(this);

    @Property({ type: 'string' })
    title!: string;

    @Property({ type: 'text' })
    description!: string;

    @Property({ type: 'string' })
    contentType!: DwengoContentType;

    @Property({ type: 'array' })
    keywords: string[] = [];

    @Property({ type: new ArrayType((i) => Number(i)), nullable: true })
    targetAges?: number[] = [];

    @Property({ type: 'bool' })
    teacherExclusive = false;

    @Property({ type: 'array' })
    skosConcepts: string[] = [];

    @Embedded({
        entity: () => EducationalGoal,
        array: true,
    })
    educationalGoals: EducationalGoal[] = [];

    @Property({ type: 'string' })
    copyright = '';

    @Property({ type: 'string' })
    license = '';

    @Property({ type: 'smallint', nullable: true })
    difficulty?: number;

    @Property({ type: 'integer', nullable: true })
    estimatedTime?: number;

    @Embedded({
        entity: () => ReturnValue,
    })
    returnValue!: ReturnValue;

    @Property({ type: 'bool' })
    available = true;

    @Property({ type: 'string', nullable: true })
    contentLocation?: string;

    @OneToMany({
        entity: () => Attachment,
        mappedBy: 'learningObject',
    })
    attachments: Collection<Attachment> = new Collection<Attachment>(this);

    @Property({ type: 'blob' })
    content!: Buffer;
}
