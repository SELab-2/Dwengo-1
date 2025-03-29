import {
    getClassJoinRequestRepository,
    getClassRepository,
    getLearningObjectRepository,
    getQuestionRepository, getStudentRepository,
    getTeacherRepository,
} from '../data/repositories.js';
import { ClassDTO, mapToClassDTO } from '../interfaces/class.js';
import { getClassStudents } from './class.js';
import {mapToQuestionDTO, mapToQuestionId, QuestionDTO, QuestionId} from '../interfaces/question.js';
import { mapToTeacher, mapToTeacherDTO, TeacherDTO } from '../interfaces/teacher.js';
import {ConflictException, NotFoundException} from "../exceptions";
import {Teacher} from "../entities/users/teacher.entity";
import {fetchStudent} from "./students";
import {ClassJoinRequestStatus} from "../entities/classes/class-join-request.entity";
import {mapToStudentRequestDTO} from "../interfaces/student-request";

export async function getAllTeachers(full: boolean): Promise<TeacherDTO[] | string[]> {
    const teacherRepository = getTeacherRepository();
    const users = await teacherRepository.findAll();

    if (full) {
        return users.map(mapToTeacherDTO);
    }
    return users.map((user) => user.username);
}

export async function fetchTeacher(username: string): Promise<Teacher> {
    const studentRepository = getStudentRepository();
    const user = await studentRepository.findByUsername(username);

    if (!user) {
        throw new NotFoundException("Teacher with username not found");
    }

    return user;
}

export async function getTeacher(username: string): Promise<TeacherDTO | null> {
    const user = await fetchTeacher(username);
    return mapToTeacherDTO(user);
}

export async function createTeacher(userData: TeacherDTO): Promise<void> {
    const teacherRepository = getTeacherRepository();

    const user = await teacherRepository.findByUsername(userData.username);

    if (user){
        throw new ConflictException("Teacher with that username already exists");
    }

    const newTeacher = teacherRepository.create(mapToTeacher(userData));
    await teacherRepository.save(newTeacher);
}

export async function deleteTeacher(username: string): Promise<void> {
    const teacherRepository = getTeacherRepository();

    await fetchTeacher(username); // throws error if it does not exist

    await teacherRepository.deleteByUsername(username);
}

async function fetchClassesByTeacher(username: string): Promise<ClassDTO[]> {
    const teacher = await fetchTeacher(username);

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

    if (!classes || classes.length === 0){
        return [];
    }

    const classIds = classes.map((cls) => cls.id);

    const students = (await Promise.all(classIds.map(async (id) => getClassStudents(id)))).flat();
    if (full) {
        return students;
    }
    return students.map((student) => student.username);
}

export async function getTeacherQuestions(username: string, full: boolean): Promise<QuestionDTO[] | QuestionId[]> {
    const teacher = await fetchTeacher(username);

    // Find all learning objects that this teacher manages
    const learningObjectRepository = getLearningObjectRepository();
    const learningObjects = await learningObjectRepository.findAllByTeacher(teacher);

    if (!learningObjects || learningObjects.length === 0){
        return [];
    }

    // Fetch all questions related to these learning objects
    const questionRepository = getQuestionRepository();
    const questions = await questionRepository.findAllByLearningObjects(learningObjects);
    const questionsDTO = questions.map(mapToQuestionDTO);

    if (full) {
        return questionsDTO;
    }

    return questionsDTO.map(mapToQuestionId);
}

export async function getJoinRequestsByClass( classId: string ){
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        throw new NotFoundException("Class with id not found");
    }

    const requestRepo = getClassJoinRequestRepository();
    const requests = await requestRepo.findAllOpenRequestsTo(cls);
    return requests.map(mapToStudentRequestDTO);
}

export async function updateClassJoinRequestStatus( studentUsername: string, classId: string, accepted: boolean = true) {
    const requestRepo = getClassJoinRequestRepository();
    const classRepo = getClassRepository();

    const student = await fetchStudent(studentUsername);
    const cls = await classRepo.findById(classId);

    if (!cls) {
        throw new NotFoundException('Class not found');
    }

    const request = await requestRepo.findByStudentAndClass(student, cls);

    if (!request) {
        throw new NotFoundException('Join request not found');
    }

    request.status = accepted ? ClassJoinRequestStatus.Accepted : ClassJoinRequestStatus.Declined;

    await requestRepo.save(request);
}
