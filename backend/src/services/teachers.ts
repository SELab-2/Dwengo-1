import {
    getClassRepository,
    getLearningObjectRepository,
    getQuestionRepository,
    getTeacherRepository,
} from '../data/repositories.js';
import { ClassDTO, mapToClassDTO } from '../interfaces/class.js';
import { getClassStudents } from './class.js';
import {mapToQuestionDTO, mapToQuestionId, QuestionDTO, QuestionId} from '../interfaces/question.js';
import { mapToTeacher, mapToTeacherDTO, TeacherDTO } from '../interfaces/teacher.js';

export async function getAllTeachers(full: boolean): Promise<TeacherDTO[] | string[]> {
    const teacherRepository = getTeacherRepository();
    const users = await teacherRepository.findAll();

    if (full) {
        return users.map(mapToTeacherDTO);
    }
    return users.map((user) => user.username);
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

async function fetchClassesByTeacher(username: string): Promise<ClassDTO[]> {
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

export async function getStudentsByTeacher(username: string, full: boolean) {
    const classes = await fetchClassesByTeacher(username);
    const classIds = classes.map((cls) => cls.id);

    const students = (await Promise.all(classIds.map(async (id) => getClassStudents(id)))).flat();
    if (full) {
        return students;
    }
    return students.map((student) => student.username);
}

export async function getTeacherQuestions(username: string, full: boolean): Promise<QuestionDTO[] | QuestionId[]> {
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
    const questionsDTO = questions.map(mapToQuestionDTO);

    if (full) {
        return questionsDTO;
    }

    return questionsDTO.map(mapToQuestionId);
}
