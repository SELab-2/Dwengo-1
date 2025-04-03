import { Student } from '../entities/users/student.entity.js';
import { getStudentRepository } from '../data/repositories.js';
import { StudentDTO } from '@dwengo-1/common/interfaces/student';

export function mapToStudentDTO(student: Student): StudentDTO {
    return {
        id: student.username,
        username: student.username,
        firstName: student.firstName,
        lastName: student.lastName,
    };
}

export function mapToStudent(studentData: StudentDTO): Student {
    return getStudentRepository().create({
        username: studentData.username,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
    });
}
