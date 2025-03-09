import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Class } from '../../entities/classes/class.entity.js';
import { Student } from '../../entities/users/student.entity.js';
import {Teacher} from "../../entities/users/teacher.entity";

export class ClassRepository extends DwengoEntityRepository<Class> {
    public findById(id: string): Promise<Class | null> {
        return this.findOne(
            { classId: id },
            { populate: ["students", "teachers"] },
        );
    }
    public deleteById(id: string): Promise<void> {
        return this.deleteWhere({ classId: id });
    }
    public findByStudent(student: Student): Promise<Class[]> {
        return this.find(
            { students: student },
            { populate: ["students", "teachers"] } // voegt student en teacher objecten toe
        )
    }

    public findByTeacher(teacher: Teacher): Promise<Class[]> {
        return this.find(
            { teachers: teacher },
            { populate: ["students", "teachers"] }
        );
    }
}
