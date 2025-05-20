import { EntityRepository, FilterQuery, SyntaxErrorException } from '@mikro-orm/core';
import { EntityAlreadyExistsException } from '../exceptions/entity-already-exists-exception.js';
import { getLogger } from '../logging/initalize.js';

export abstract class DwengoEntityRepository<T extends object> extends EntityRepository<T> {
    public async save(entity: T, options?: { preventOverwrite?: boolean }): Promise<void> {
        if (options?.preventOverwrite && (await this.findOne(entity))) {
            throw new EntityAlreadyExistsException(`A ${this.getEntityName()} with this identifier already exists.`);
        }
        try {
            await this.getEntityManager().persistAndFlush(entity);
        } catch (e: unknown) {
            // Workaround for MikroORM bug: Sometimes, queries are generated with random syntax errors.
            // The faulty query is then retried everytime something is persisted. By clearing the entity
            // Manager in that case, we make sure that future queries will work.
            if (e instanceof SyntaxErrorException) {
                getLogger().error("SyntaxErrorException caught => entity manager cleared.");
                this.em.clear();
            } else {
                throw e;
            }
        }
    }
    public async deleteWhere(query: FilterQuery<T>): Promise<void> {
        const toDelete = await this.findOne(query);
        const em = this.getEntityManager();
        if (toDelete) {
            em.remove(toDelete);
            await em.flush();
        }
    }
    public async deleteAllWhere(query: FilterQuery<T>): Promise<void> {
        const toDelete = await this.find(query);
        const em = this.getEntityManager();

        if (toDelete) {
            em.remove(toDelete);
            await em.flush();
        }
    }
}
