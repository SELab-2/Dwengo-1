import {
    getClassRepository,
    getLearningObjectRepository,
    getQuestionRepository,
    getTeacherRepository,
} from '../data/repositories.js';
import { ClassDTO, mapToClassDTO } from '../interfaces/class.js';
import { getClassStudents } from './classes.js';
import { StudentDTO } from '../interfaces/student.js';
import { mapToQuestionDTO, mapToQuestionId, QuestionDTO, QuestionId } from '../interfaces/question.js';
import { mapToTeacher, mapToTeacherDTO, TeacherDTO } from '../interfaces/teacher.js';

export async function getAllTeachers(full: boolean): Promise<TeacherDTO[] | string[]> {
    const teacherRepository = getTeacherRepository();
    const teachers = await teacherRepository.findAll();

    if (full) {
        return teachers.map(mapToTeacherDTO);
    }

    return teachers.map((teacher) => teacher.username);
}

export async function getTeacher(username: string): Promise<TeacherDTO | null> {
    const teacherRepository = getTeacherRepository();
    const user = await teacherRepository.findByUsername(username);
    return user ? mapToTeacherDTO(user) : null;
}

export async function createTeacher(userData: TeacherDTO): Promise<TeacherDTO | null> {
    const teacherRepository = getTeacherRepository();

    const newTeacher = teacherRepository.create(mapToTeacher(userData));
    await teacherRepository.save(newTeacher);

    return mapToTeacherDTO(newTeacher);
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

export async function fetchClassesByTeacher(username: string): Promise<ClassDTO[] | null> {
    const teacherRepository = getTeacherRepository();
    const teacher = await teacherRepository.findByUsername(username);
    if (!teacher) {
        return null;
    }

    const classRepository = getClassRepository();
    const classes = await classRepository.findByTeacher(teacher);
    return classes.map(mapToClassDTO);
}

export async function getClassesByTeacher(username: string, full: boolean): Promise<ClassDTO[] | string[] | null> {
    const classes = await fetchClassesByTeacher(username);

    if (!classes) {
        return null;
    }

    if (full) {
        return classes;
    }

    return classes.map((cls) => cls.id);
}

export async function fetchStudentsByTeacher(username: string): Promise<StudentDTO[] | null> {
    const classes = (await getClassesByTeacher(username, false)) as string[];

    if (!classes) {
        return null;
    }

    return (await Promise.all(classes.map(async (id) => getClassStudents(id)))).flat();
}

export async function getStudentsByTeacher(username: string, full: boolean): Promise<StudentDTO[] | string[] | null> {
    const students = await fetchStudentsByTeacher(username);

    if (!students) {
        return null;
    }

    if (full) {
        return students;
    }

    return students.map((student) => student.username);
}

export async function fetchTeacherQuestions(username: string): Promise<QuestionDTO[] | null> {
    const teacherRepository = getTeacherRepository();
    const teacher = await teacherRepository.findByUsername(username);
    if (!teacher) {
        return null;
    }

    // Find all learning objects that this teacher manages
    const learningObjectRepository = getLearningObjectRepository();
    const learningObjects = await learningObjectRepository.findAllByTeacher(teacher);

    // Fetch all questions related to these learning objects
    const questionRepository = getQuestionRepository();
    const questions = await questionRepository.findAllByLearningObjects(learningObjects);

    return questions.map(mapToQuestionDTO);
}

export async function getQuestionsByTeacher(username: string, full: boolean): Promise<QuestionDTO[] | QuestionId[] | null> {
    const questions = await fetchTeacherQuestions(username);

    if (!questions) {
        return null;
    }

    if (full) {
        return questions;
    }

    return questions.map(mapToQuestionId);
}
