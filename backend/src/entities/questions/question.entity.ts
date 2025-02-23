import {Entity, Enum, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {Language} from "../content/language";
import {Student} from "../users/student.entity";

@Entity()
export class Question {
    @ManyToOne({entity: () => Student, primary: true})
    author!: Student;

    @PrimaryKey({type: "string"})
    learningObjectHruid!: string;

    @Enum({items: () => Language, primary: true})
    learningObjectLanguage!: Language;

    @PrimaryKey({type: "string"})
    learningObjectVersion!: number = "1";

    @PrimaryKey({type: "datetime"})
    timestamp!: Date;

    @Property({type: "text"})
    content!: string;
}
