import {Student} from "../users/student.entity";
import {Group} from "./group.entity";
import {Entity, Enum, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {Language} from "../content/language";

@Entity()
export class Submission {
    @PrimaryKey({type: "string"})
    learningObjectHruid!: string;

    @Enum({items: () => Language, primary: true})
    learningObjectLanguage!: Language;

    @PrimaryKey({type: "string"})
    learningObjectVersion: string = "1";

    @PrimaryKey({type: "integer"})
    submissionNumber!: number;

    @ManyToOne({entity: () => Student})
    submitter!: Student;

    @Property({type: "datetime"})
    submissionTime!: Date;

    @ManyToOne({entity: () => Group, nullable: true})
    onBehalfOf?: Group;

    @Property({type: "json"})
    content!: string;
}
