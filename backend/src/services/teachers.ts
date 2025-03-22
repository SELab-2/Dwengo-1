import { getClassRepository, getLearningObjectRepository, getQuestionRepository, getTeacherRepository } from '../data/repositories.js';
import { ClassDTO, mapToClassDTO } from '../interfaces/class.js';
import { getClassStudents } from './class.js';
import { StudentDTO } from '../interfaces/student.js';
import { mapToQuestionDTO, mapToQuestionId, QuestionDTO, QuestionId } from '../interfaces/question.js';
import { mapToTeacher, mapToTeacherDTO, TeacherDTO } from '../interfaces/teacher.js';
import { getLogger } from '../logging/initalize.js';

export async function getAllTeachers(): Promise<TeacherDTO[]> {
    const teacherRepository = getTeacherRepository();
    const users = await teacherRepository.findAll();
    return users.map(mapToTeacherDTO);
}

export async function getAllTeacherIds(): Promise<string[]> {
    const users = await getAllTeachers();
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
        getLogger().error(e);
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
        getLogger().error(e);
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

export async function getClassesByTeacher(username: string): Promise<ClassDTO[]> {
    return await fetchClassesByTeacher(username);
}

export async function getClassIdsByTeacher(username: string): Promise<string[]> {
    const classes = await fetchClassesByTeacher(username);
    return classes.map((cls) => cls.id);
}

export async function fetchStudentsByTeacher(username: string) {
    const classes = await getClassIdsByTeacher(username);

    return (await Promise.all(classes.map(async (id) => getClassStudents(id)))).flat();
}

export async function getStudentsByTeacher(username: string): Promise<StudentDTO[]> {
    return await fetchStudentsByTeacher(username);
}

export async function getStudentIdsByTeacher(username: string): Promise<string[]> {
    const students = await fetchStudentsByTeacher(username);
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

export async function getQuestionsByTeacher(username: string): Promise<QuestionDTO[]> {
    return await fetchTeacherQuestions(username);
}

export async function getQuestionIdsByTeacher(username: string): Promise<QuestionId[]> {
    const questions = await fetchTeacherQuestions(username);

    return questions.map(mapToQuestionId);
}
