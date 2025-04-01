import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { EntityAlreadyExistsException } from '../exceptions/entity-already-exists-exception.js';

export abstract class DwengoEntityRepository<T extends object> extends EntityRepository<T> {
    public async save(entity: T, options?: { preventOverwrite?: boolean }): Promise<void> {
        if (options?.preventOverwrite && (await this.findOne(entity))) {
            throw new EntityAlreadyExistsException(`A ${this.getEntityName()} with this identifier already exists.`);
        }
        await this.getEntityManager().persistAndFlush(entity);
    }
    public async deleteWhere(query: FilterQuery<T>): Promise<void> {
        const toDelete = await this.findOne(query);
        const em = this.getEntityManager();
        if (toDelete) {
            em.remove(toDelete);
            await em.flush();
        }
    }
}
