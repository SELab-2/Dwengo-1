import {Student} from "../users/student.entity";
import {Group} from "./group.entity";
import {Entity, Enum, ManyToOne, PrimaryKey} from "@mikro-orm/core";
import {Language} from "../content/language";

@Entity()
export class Submission {
    @ManyToOne({entity: () => Student, primary: true})
    submitter!: Student;

    @ManyToOne({entity: () => Group, primary: true})
    onBehalfOf!: Group;

    @PrimaryKey({type: "string"})
    hruid!: string;

    @Enum({items: () => Language, primary: true})
    language!: Language;

    @PrimaryKey({type: "string"})
    version: number = "1";
}
