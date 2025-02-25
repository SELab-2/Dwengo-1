import {User} from "./user.entity";
import {Collection, Entity, ManyToMany} from '@mikro-orm/core';
import {Class} from "../classes/class.entity";
import {Group} from "../assignments/group.entity";
import {StudentRepository} from "../../data/users/student-repository";

@Entity({repository: () => StudentRepository})
export class Student extends User {
    @ManyToMany(() => Class)
    classes!: Collection<Class>;

    @ManyToMany(() => Group)
    groups!: Collection<Group>;

    constructor(public username: string, public firstName: string, public lastName: string) {
        super();
    }
}
