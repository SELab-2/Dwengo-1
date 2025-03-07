import {getClassRepository, getTeacherRepository} from "../data/repositories.js";
import {mapToTeacher, mapToTeacherDTO, TeacherDTO} from "../interfaces/teacher.js";
import { Teacher } from "../entities/users/teacher.entity";
import {ClassDTO, mapToClassDTO} from "../interfaces/classes";
import {getClassStudents, getClassStudentsIds} from "./class";
import {StudentDTO} from "../interfaces/students";


async function fetchAllTeachers(): Promise<TeacherDTO[]> {
    const teacherRepository = getTeacherRepository();
    const teachers = await teacherRepository.find({});

    return teachers.map(mapToTeacherDTO);
}

export async function getAllTeachers(): Promise<TeacherDTO[]> {
    return await fetchAllTeachers();
}

export async function getAllTeachersIds(): Promise<string[]> {
    return await fetchAllTeachers().map((teacher) => teacher.username)
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

async function fetchClassesByTeacher(username: string): Promise<ClassDTO[]> {
    const teacherRepository = getTeacherRepository();
    const classRepository = getClassRepository();

    const teacher = await teacherRepository.findByUsername(username);
    if (!teacher) {
        return [];
    }

    const classes = await classRepository.findByTeacher(teacher);
    return classes.map(mapToClassDTO);
}

export async function getClassesByTeacher(username: string): Promise<ClassDTO[]> {
    return await fetchClassesByTeacher(username)
}

export async function getClassIdsByTeacher(): Promise<string[]> {
    return await fetchClassesByTeacher(username).map((cls) => cls.id);
}

async function fetchStudentsByTeacher(username: string) {
    const classes = await getClassIdsByTeacher();

    return Promise.all(
        classes.map( async (id) => getClassStudents(id))
    );
}

export async function getStudentsByTeacher(username: string): Promise<StudentDTO[]> {
    return await fetchStudentsByTeacher(username);
}

export async function getStudentIdsByTeacher(): Promise<string[]> {
    return await fetchStudentsByTeacher(username).map((student) => student.username);
}



