import {User} from "./user.entity";
import {Collection, Entity, ManyToMany} from '@mikro-orm/core';
import {Class} from "../classes/class.entity";

@Entity()
export class Student extends User {
    @ManyToMany(() => Class)
    classes!: Collection<Class>;
}
