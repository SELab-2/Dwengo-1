import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class EducationalGoal {
    @Property({ type: 'string' })
    source!: string;

    @Property({ type: 'string' })
    id!: string;
}
