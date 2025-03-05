import { Student } from "../entities/users/student.entity";

export interface StudentDTO {
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

export function mapToStudentDTO(student: Student): StudentDTO {
    return {
        id: student.username,
        username: student.username,
        firstName: student.firstName,
        lastName: student.lastName,
    };
}