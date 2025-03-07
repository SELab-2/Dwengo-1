import {
    Embeddable,
    Embedded,
    Entity,
    Enum,
    ManyToMany,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Language } from './language.js';
import { Attachment } from './attachment.entity.js';
import { Teacher } from '../users/teacher.entity.js';
import {DwengoContentType} from "../../services/learning-objects/processing/content-type";

@Entity()
export class LearningObject {
    @PrimaryKey({ type: 'string' })
    hruid!: string;

    @Enum({ items: () => Language, primary: true })
    language!: Language;

    @PrimaryKey({ type: 'string' })
    version: string = '1';

    @ManyToMany({ entity: () => Teacher })
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
    targetAges?: number[];

    @Property({ type: 'bool' })
    teacherExclusive: boolean = false;

    @Property({ type: 'array' })
    skosConcepts!: string[];

    @Embedded({ entity: () => EducationalGoal, array: true })
    educationalGoals: EducationalGoal[] = [];

    @Property({ type: 'string' })
    copyright: string = '';

    @Property({ type: 'string' })
    license: string = '';

    @Property({ type: 'smallint', nullable: true })
    difficulty?: number;

    @Property({ type: 'integer' })
    estimatedTime!: number;

    @Embedded({ entity: () => ReturnValue })
    returnValue!: ReturnValue;

    @Property({ type: 'bool' })
    available: boolean = true;

    @Property({ type: 'string', nullable: true })
    contentLocation?: string;

    @OneToMany({ entity: () => Attachment, mappedBy: 'learningObject' })
    attachments: Attachment[] = [];

    @Property({ type: 'blob' })
    content!: Buffer;
}

@Embeddable()
export class EducationalGoal {
    @Property({ type: 'string' })
    source!: string;

    @Property({ type: 'string' })
    id!: string;
}

@Embeddable()
export class ReturnValue {
    @Property({ type: 'string' })
    callbackUrl!: string;

    @Property({ type: 'json' })
    callbackSchema!: string;
}
