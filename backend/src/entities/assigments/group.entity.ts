import {Entity, ManyToMany, ManyToOne, PrimaryKey} from "@mikro-orm/core";
import {Assignment} from "./assignment.entity";
import {Student} from "../users/student.entity";

@Entity()
export class Group {
    @ManyToOne({entity: () => Assignment, primary: true})
    assignment!: Assignment;

    @PrimaryKey({type: "integer"})
    groupNumber!: number;

    @ManyToMany({entity: Student})
    members!: Student[];
}
