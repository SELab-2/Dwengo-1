import { Teacher } from '../entities/users/teacher.entity.js';
import { getTeacherRepository } from '../data/repositories';

export interface TeacherDTO {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    endpoints?: {
        classes: string;
        questions: string;
        invitations: string;
        groups: string;
    };
}

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
