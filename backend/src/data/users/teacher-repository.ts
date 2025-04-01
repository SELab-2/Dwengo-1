import { Teacher } from '../../entities/users/teacher.entity.js';
import { DwengoEntityRepository } from '../dwengo-entity-repository.js';

export class TeacherRepository extends DwengoEntityRepository<Teacher> {
    public async findByUsername(username: string): Promise<Teacher | null> {
        return this.findOne({ username: username });
    }
    public async deleteByUsername(username: string): Promise<void> {
        return this.deleteWhere({ username: username });
    }
}
