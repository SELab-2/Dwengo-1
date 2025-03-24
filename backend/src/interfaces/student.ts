import { Student } from '../entities/users/student.entity.js';

export interface StudentDTO {
    id?: string;
    username: string;
    firstName: string;
    lastName: string;
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
    const student = new Student(studentData.username, studentData.firstName, studentData.lastName);

    return student;
}
