import { Collection, Entity, ManyToMany } from '@mikro-orm/core';
import { User } from './user.entity.js';
import { Class } from '../classes/class.entity.js';

@Entity()
export class Teacher extends User {
    @ManyToMany(() => {
        return Class;
    })
    classes!: Collection<Class>;
}
