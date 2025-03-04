import { getStudentRepository } from "../data/repositories";
import { StudentDTO } from "../interfaces/students";

export async function getStudentById(username: string): Promise<StudentDTO | null> {
    const studentRepository = getStudentRepository();
    const student = await studentRepository.findByUsername(username);

    if (!student) return null;
    else {
        return {
            id: student.username,
            username: student.username,
            firstName: student.firstName,
            lastName: student.lastName,
        }
    }
}

