import { Teacher } from '../entities/users/teacher.entity.js';

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

export function mapToTeacher(TeacherData: TeacherDTO): Teacher {
    const teacher = new Teacher(TeacherData.username, TeacherData.firstName, TeacherData.lastName);

    return teacher;
}
