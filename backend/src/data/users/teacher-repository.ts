import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Teacher } from '../../entities/users/teacher.entity.js';

export class TeacherRepository extends DwengoEntityRepository<Teacher> {
    public findByUsername(username: string): Promise<Teacher | null> {
        return this.findOne({ username: username });
    }
    public deleteByUsername(username: string): Promise<void> {
        return this.deleteWhere({ username: username });
    }
}
