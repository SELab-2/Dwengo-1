import { Entity } from '@mikro-orm/core';
import {User} from "./user.entity";

@Entity()
export class Teacher extends User {

}
