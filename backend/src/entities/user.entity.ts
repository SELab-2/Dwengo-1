import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class User {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property()
  firstName: string = '';

  @Property()
  lastName: string = '';
}