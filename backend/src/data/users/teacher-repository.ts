import { Teacher } from '../../entities/users/teacher.entity.js';
import { UserRepository } from './user-repository.js';

export class TeacherRepository extends UserRepository<Teacher> {}
