import { Student } from '../../entities/users/student.entity.js';
import { UserRepository } from './user-repository.js';

export class StudentRepository extends UserRepository<Student> {}
