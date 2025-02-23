import {Entity, ManyToOne, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {Class} from "../classes/class.entity";
import {LearningPath} from "../content/learning-path.entity";
import {Group} from "./group.entity"

@Entity()
export class Assignment {
    @ManyToOne({entity: () => Class, primary: true})
    within!: Class;

    @PrimaryKey({type: "number"})
    id!: number;

    @Property({type: "string"})
    title!: string;

    @Property({type: "text"})
    description!: string;

    @ManyToOne({entity: () => LearningPath})
    task!: LearningPath;

    @OneToMany({entity: () => Group, mappedBy: "assignment"})
    groups!: Group[];
}
