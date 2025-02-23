import {Embeddable, Embedded, Entity, Enum, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {Language} from "./language";
import {Attachment} from "./attachment.entity";

@Entity()
export class LearningObject {
    @PrimaryKey({type: "string"})
    hruid!: string;

    @Enum({items: () => Language, primary: true})
    language!: Language;

    @PrimaryKey({type: "string"})
    version: number = "1";

    @PrimaryKey({type: "string"})
    author!: string;

    @Property({type: "string"})
    title!: string;

    @Property({type: "text"})
    description!: string;

    @Property({type: "string"})
    contentType!: string;

    @Property({type: "array"})
    keywords: string[] = [];

    @Property({type: "array", nullable: true})
    targetAges?: number[];

    @Property({type: "bool"})
    teacherExclusive: boolean = false;

    @Property({type: "array"})
    skosConcepts!: string[];

    @Embedded({entity: () => EducationalGoal, array: true})
    educationalGoals: EducationalGoal[] = [];

    @Property({type: "string"})
    copyright: string = ""

    @Property({type: "string"})
    license: string = ""

    @Property({type: "smallint", nullable: true})
    difficulty?: number;

    @Property({type: "integer"})
    estimatedTime!: number;

    @Property({type: "bool"})
    available: boolean = true;

    @Property({type: "string", nullable: true})
    contentLocation?: string;

    @OneToMany({entity: () => Attachment, mappedBy: "learningObject"})
    attachments: Attachment[] = [];

    @Property({type: "blob"})
    content: Buffer;
}

@Embeddable()
export class EducationalGoal {
    @Property({type: "string"})
    source: string;

    @Property({type: "string"})
    id: string;
}

@Embeddable()
export class ReturnValue {
    @Property({type: "string"})
    callbackUrl: string;

    @Property({type: "json"})
    callbackSchema: Object;
}

export enum ContentType {
    Markdown = "text/markdown",
    Image = "image/image",
    Mpeg = "audio/mpeg",
    Pdf = "application/pdf",
    Extern = "extern",
    Blockly = "Blockly"
}
