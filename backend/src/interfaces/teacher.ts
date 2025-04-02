import { Teacher } from '../entities/users/teacher.entity.js';
import { getTeacherRepository } from '../data/repositories.js';
import { TeacherDTO } from '@dwengo-1/common/interfaces/teacher';

export function mapToTeacherDTO(teacher: Teacher): TeacherDTO {
    return {
        id: teacher.username,
        username: teacher.username,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
    };
}

export function mapToTeacher(teacherData: TeacherDTO): Teacher {
    return getTeacherRepository().create({
        username: teacherData.username,
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
    });
}
