import {
    getClassRepository,
    getLearningObjectRepository,
    getQuestionRepository,
    getStudentRepository,
    getTeacherRepository,
} from '../data/repositories.js';
import { Teacher } from '../entities/users/teacher.entity.js';
import { ClassDTO, mapToClassDTO } from '../interfaces/class.js';
import { getClassStudents } from './classes.js';
import { StudentDTO } from '../interfaces/student.js';
import { mapToQuestionDTO, mapToQuestionId, QuestionDTO, QuestionId } from '../interfaces/question.js';
import { mapToUser } from '../interfaces/user.js';
import { mapToTeacher, mapToTeacherDTO, TeacherDTO } from '../interfaces/teacher.js';
import { teachersOnly } from '../middleware/auth/auth.js';

export async function getAllTeachers(full: boolean): Promise<TeacherDTO[] | string[]> {
    const teacherRepository = getTeacherRepository();
    const teachers = await teacherRepository.findAll();

    if (full) {
        return teachers.map(mapToTeacherDTO);
    }

    return teachers.map(teacher => teacher.username);
}

export async function getTeacher(username: string): Promise<TeacherDTO | null> {
    const teacherRepository = getTeacherRepository();
    const user = await teacherRepository.findByUsername(username);
    return user ? mapToTeacherDTO(user) : null;
}

export async function createTeacher(userData: TeacherDTO): Promise<TeacherDTO | null> {
    const teacherRepository = getTeacherRepository();

    try {
        const newTeacher = teacherRepository.create(mapToTeacher(userData));
        await teacherRepository.save(newTeacher);

        return mapToTeacherDTO(newTeacher);
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function deleteTeacher(username: string): Promise<TeacherDTO | null> {
    const teacherRepository = getTeacherRepository();

    const user = await teacherRepository.findByUsername(username);

    if (!user) {
        return null;
    }

    try {
        await teacherRepository.deleteByUsername(username);

        return mapToTeacherDTO(user);
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function fetchClassesByTeacher(username: string): Promise<ClassDTO[]> {
    const teacherRepository = getTeacherRepository();
    const teacher = await teacherRepository.findByUsername(username);
    if (!teacher) {
        return [];
    }

    const classRepository = getClassRepository();
    const classes = await classRepository.findByTeacher(teacher);
    return classes.map(mapToClassDTO);
}

export async function getClassesByTeacher(username: string, full: boolean): Promise<ClassDTO[] | string[]> {
    const classes = await fetchClassesByTeacher(username);

    if (full) {
        return classes;
    }

    return classes.map((cls) => cls.id);
}

export async function fetchStudentsByTeacher(username: string) {
    const classes = await getClassesByTeacher(username, false) as string[];

    return (await Promise.all(classes.map(async (id) => getClassStudents(id)))).flat();
}

export async function getStudentsByTeacher(username: string, full: boolean): Promise<StudentDTO[] | string[]> {
    const students = await fetchStudentsByTeacher(username);

    if (full) {
        return students;
    }

    return students.map((student) => student.username);
}

export async function fetchTeacherQuestions(username: string): Promise<QuestionDTO[]> {
    const teacherRepository = getTeacherRepository();
    const teacher = await teacherRepository.findByUsername(username);
    if (!teacher) {
        throw new Error(`Teacher with username '${username}' not found.`);
    }

    // Find all learning objects that this teacher manages
    const learningObjectRepository = getLearningObjectRepository();
    const learningObjects = await learningObjectRepository.findAllByTeacher(teacher);

    // Fetch all questions related to these learning objects
    const questionRepository = getQuestionRepository();
    const questions = await questionRepository.findAllByLearningObjects(learningObjects);

    return questions.map(mapToQuestionDTO);
}

export async function getQuestionsByTeacher(username: string, full: boolean): Promise<QuestionDTO[] | QuestionId[]> {
    const questions = await fetchTeacherQuestions(username);

    if (full) {
        return questions;
    }

    return questions.map(mapToQuestionId);
}
