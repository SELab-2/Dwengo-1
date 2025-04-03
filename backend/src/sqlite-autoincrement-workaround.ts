import { EntityProperty, EventArgs, EventSubscriber } from '@mikro-orm/core';

/**
 * The tests are ran on an in-memory SQLite database. However, SQLite does not allow fields which are part of composite
 * primary keys to be autoincremented (while PostgreSQL, which we use in production, does). This Subscriber works around
 * the issue by remembering the highest values for every autoincremented part of a primary key and assigning them when
 * creating a new entity.
 *
 * However, it is important to note the following limitations:
 * - this class can only be used for in-memory SQLite databases since the information on what the highest sequence
 *   number for each of the properties is, is only saved transiently.
 * - automatically setting the generated "autoincremented" value for properties only works when the entity is created
 *   via an entityManager.create(...) or repo.create(...) method. Otherwise, onInit will not be called and therefore,
 *   the sequence number will not be filled in.
 */
export class SqliteAutoincrementSubscriber implements EventSubscriber {
    private sequenceNumbersForEntityType = new Map<string, number>();

    /**
     * When an entity with an autoincremented property which is part of the composite private key is created,
     * automatically fill this property so we won't face not-null-constraint exceptions when persisting it.
     */
    onInit<T extends object>(args: EventArgs<T>): void {
        if (!args.meta.compositePK) {
            return; // If there is not a composite primary key, autoincrement works fine with SQLite anyway.
        }

        for (const prop of Object.values(args.meta.properties)) {
            const property = prop as EntityProperty<T>;
            if (property.primary && property.autoincrement && !(args.entity as Record<string, unknown>)[property.name]) {
                // Obtain and increment sequence number of this entity.
                const propertyKey = args.meta.class.name + '.' + property.name;
                const nextSeqNumber = this.sequenceNumbersForEntityType.get(propertyKey) || 0;
                this.sequenceNumbersForEntityType.set(propertyKey, nextSeqNumber + 1);

                // Set the property accordingly.
                (args.entity as Record<string, unknown>)[property.name] = nextSeqNumber + 1;
            }
        }
    }
}
