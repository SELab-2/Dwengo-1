import { Student } from '../../entities/users/student.entity.js';
import { DwengoEntityRepository } from '../dwengo-entity-repository.js';

export class StudentRepository extends DwengoEntityRepository<Student> {
    public async findByUsername(username: string): Promise<Student | null> {
        return this.findOne({ username: username });
    }
    public async deleteByUsername(username: string): Promise<void> {
        return this.deleteWhere({ username: username });
    }
}
