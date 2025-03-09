import { getClassRepository, getStudentRepository } from "../data/repositories.js";
import { Class } from "../entities/classes/class.entity.js";
import { Student } from "../entities/users/student.entity.js";
import { ClassDTO, mapToClassDTO } from "../interfaces/classes.js";
import {UserService} from "./users.js";

export class StudentService extends UserService<Student> {
    constructor() {
        super(getStudentRepository());
    }
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

