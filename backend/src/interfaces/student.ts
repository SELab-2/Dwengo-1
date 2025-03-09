import { Student } from '../entities/users/student.entity.js';

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

export function mapToStudent(studentData: StudentDTO): Student {
    const student = new Student();
    student.username = studentData.username;
    student.firstName = studentData.firstName;
    student.lastName = studentData.lastName;

    return student;
}
