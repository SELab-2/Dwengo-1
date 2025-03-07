import { getClassRepository } from "../data/repositories";
import { Class } from "../entities/classes/class.entity";
import { ClassDTO, mapToClassDTO } from "../interfaces/classes";
import { mapToStudentDTO, StudentDTO } from "../interfaces/students";

export async function getAllClasses(full: boolean): Promise<ClassDTO[] | string[]> {
    const classRepository = getClassRepository();
    const classes = await classRepository.find({}, { populate: ["students", "teachers"] });

    if (!classes) {
        return [];
    }

    if (full) {
        return classes.map(mapToClassDTO);
    } else {
        return classes.map((cls) => cls.classId);
    }
}

export async function getClass(classId: string): Promise<ClassDTO | null> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) return null;
    else {
        return mapToClassDTO(cls);
    }
}

async function fetchClassStudents(classId: string, full: boolean): Promise<StudentDTO[] | string[]> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls)
        return [];

    return cls.students.map(mapToStudentDTO);
}

export async function getClassStudents(classId: string): Promise<StudentDTO[]> {
    return await fetchClassStudents(classId);
}

export async function getClassStudentsIds(classId: string): Promise<string[]> {
    return await fetchClassStudents(classId).map((student) => student.username);
}

