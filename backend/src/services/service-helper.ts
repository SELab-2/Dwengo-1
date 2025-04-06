import { EntityDTO, FromEntityType } from "@mikro-orm/core";
import { DwengoEntityRepository } from "../data/dwengo-entity-repository";

/**
 * Utility function to perform an PUT on an object.
 *
 * @param object The object that needs to be changed
 * @param data The datafields and their values that will be updated
 * @param repo The repository on which this action needs to be performed
 * 
 * @returns Nothing.
 */
export async function putObject<T extends Object, DTO>(
    object: T, 
    data: Partial<EntityDTO<FromEntityType<T>>>, 
    repo: DwengoEntityRepository<T>
): Promise<void> {
    repo.assign(object, data);
    await repo.getEntityManager().flush();
}