import { Teacher } from "../entities/users/teacher.entity";

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