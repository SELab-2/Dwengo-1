import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Class } from '../../entities/classes/class.entity.js';

export class ClassRepository extends DwengoEntityRepository<Class> {
    public findById(id: string): Promise<Class | null> {
        return this.findOne({ classId: id });
    }
    public deleteById(id: string): Promise<void> {
        return this.deleteWhere({ classId: id });
    }
}
