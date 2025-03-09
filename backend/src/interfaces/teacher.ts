import { Teacher } from "../entities/users/teacher.entity.js";

/**
 * Teacher Data Transfer Object
 */
export interface TeacherDTO {
    username: string;
    firstName: string;
    lastName: string;
    endpoints?: {
        self: string;
        classes: string;
        questions: string;
        invitations: string;
    };
}

/**
 * Maps a Teacher entity to a TeacherDTO
 */
export function mapToTeacherDTO(teacher: Teacher): TeacherDTO {
    return {
        username: teacher.username,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
    };
}

export function mapToTeacher(teacherData: TeacherDTO): Teacher {
    const teacher = new Teacher();
    teacher.username = teacherData.username;
    teacher.firstName = teacherData.firstName;
    teacher.lastName = teacherData.lastName;

    return teacher;
}
