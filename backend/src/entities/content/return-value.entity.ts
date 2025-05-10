import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class ReturnValue {
    @Property({ type: 'string' })
    callbackUrl!: string;

    @Property({ type: 'json' })
    callbackSchema!: string;
}
