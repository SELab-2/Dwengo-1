import { Collection, Entity, ManyToMany } from '@mikro-orm/core';
import { User } from './user.entity';
import { Class } from '../classes/class.entity';

@Entity()
export class Teacher extends User {
    @ManyToMany(() => Class)
    classes!: Collection<Class>;
}
