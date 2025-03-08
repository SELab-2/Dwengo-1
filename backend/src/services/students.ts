import { getClassRepository, getStudentRepository } from "../data/repositories";
import { Class } from "../entities/classes/class.entity";
import { Student } from "../entities/users/student.entity";
import { ClassDTO, mapToClassDTO } from "../interfaces/class";
import { StudentDTO, mapToStudentDTO } from "../interfaces/student";


export async function getAllStudents(): Promise<StudentDTO[]> {
    const studentRepository = getStudentRepository();
    const students = await studentRepository.find({});

    return students.map(mapToStudentDTO);
}

export async function getStudent(username: string): Promise<StudentDTO | null> {
    const studentRepository = getStudentRepository();
    const student = await studentRepository.findByUsername(username);

    if  (!student) {
        return null;
    }

    return mapToStudentDTO(student);
}

async function fetchStudentClasses(username: string): Promise<Class[]> {
    const studentRepository = getStudentRepository();
    const student = await studentRepository.findByUsername(username);

    if (!student) return [];

    const classRepository = getClassRepository();
    const classes = await classRepository.findByStudent(student);

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

