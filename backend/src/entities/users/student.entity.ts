import {User} from "./user.entity";
import { Entity } from '@mikro-orm/core';

@Entity()
export class Student extends User {
}
