import {getTeacherRepository} from "../data/repositories.js";
import {mapToTeacher, mapToTeacherDTO, TeacherDTO} from "../interfaces/teacher.js";
import { Teacher } from "../entities/users/teacher.entity";


export async function fetchAllTeachers(): Promise<TeacherDTO[]> {
    const teacherRepository = getTeacherRepository();
    const teachers = await teacherRepository.find({});

    return teachers.map(mapToTeacherDTO);
}

export async function createTeacher(teacherData: TeacherDTO): Promise<Teacher> {
    const teacherRepository = getTeacherRepository();
    const newTeacher = mapToTeacher(teacherData);

    await teacherRepository.addTeacher(newTeacher);
    return newTeacher;
}

export async function fetchTeacherByUsername(username: string): Promise<TeacherDTO | null> {
    const teacherRepository = getTeacherRepository();
    const teacher = await teacherRepository.findByUsername(username);

    return teacher ? mapToTeacherDTO(teacher) : null;
}

export async function deleteTeacher(username: string): Promise<TeacherDTO | null> {
    const teacherRepository = getTeacherRepository();
    const teacher = await teacherRepository.findByUsername(username);

    if (!teacher)
        return null;

    await teacherRepository.deleteByUsername(username);
    return teacher;
}

