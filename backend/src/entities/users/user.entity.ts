import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({abstract: true})
export class User {
    @PrimaryKey({type: "string"})
    username!: string;

    @Property()
    firstName: string = '';

    @Property()
    lastName: string = '';
}
