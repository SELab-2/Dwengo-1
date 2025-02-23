import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {Question} from "./question.entity";
import {Teacher} from "../users/teacher.entity";

@Entity()
export class Answer {

    @ManyToOne({entity: () => Teacher, primary: true})
    author!: Teacher;

    @ManyToOne({entity: () => Question, primary: true})
    toQuestion!: Question;

    @PrimaryKey({type: "datetime"})
    timestamp: Date;

    @Property({type: "text"})
    content: string;
}
