import {EntityRepository, FilterQuery} from "@mikro-orm/core";

export abstract class DwengoEntityRepository<T extends object> extends EntityRepository<T> {
    public async save(entity: T) {
        let em = this.getEntityManager();
        em.persist(entity);
        await em.flush();
    }
    public async deleteWhere(query: FilterQuery<T>) {
        let toDelete = await this.findOne(query);
        let em = this.getEntityManager();
        if (toDelete) {
            em.remove(toDelete);
            await em.flush();
        }
    }
}
