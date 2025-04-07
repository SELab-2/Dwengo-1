import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class User {
    @PrimaryKey({ type: 'string' })
    username!: string;

    @Property()
    firstName = '';

    @Property()
    lastName = '';
}
