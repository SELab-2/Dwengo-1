import { getClassRepository, getStudentRepository } from "../data/repositories";
import { Class } from "../entities/classes/class.entity";
import { ClassDTO, mapToClassDTO } from "../interfaces/classes";
import { StudentDTO } from "../interfaces/students";

export async function getAllStudents(): Promise<StudentDTO[]> {
    // TODO
    return [];
}

export async function getStudent(username: string): Promise<StudentDTO | null> {
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

async function fetchStudentClasses(username: string): Promise<Class[]> {
    const studentRepository = getStudentRepository();
    const student = await studentRepository.findByUsername(username);

    if (!student) return [];

    const classRepository = getClassRepository();
    // a weird error when running npm run dev occurs when using .findByStudent
    // the error says that the function could not be found which is weird
    // because typescript does not throw any errors
    const classes = await classRepository.find(
        { students: student },
        { populate: ["students", "teachers"] } // voegt student en teacher objecten toe
    )
    // const classes = await classRepository.findByStudent(student);

    if (!classes) return [];

    return classes;
}

export async function getStudentClasses(username: string): Promise<ClassDTO[]> {
    const classes = await fetchStudentClasses(username);
    return classes.map(mapToClassDTO);
}

export async function getStudentClassIds(username: string): Promise<string[]> {
    const classes = await fetchStudentClasses(username);
    return classes.map(cls => cls.classId); // 'class' is a native keyword
}

