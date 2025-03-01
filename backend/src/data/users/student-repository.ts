import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Student } from '../../entities/users/student.entity.js';

export class StudentRepository extends DwengoEntityRepository<Student> {
    public findByUsername(username: string): Promise<Student | null> {
        return this.findOne({ username: username });
    }
    public deleteByUsername(username: string): Promise<void> {
        return this.deleteWhere({ username: username });
    }
}
