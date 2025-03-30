import {
    getClassJoinRequestRepository,
    getClassRepository,
    getLearningObjectRepository,
    getQuestionRepository,
    getTeacherRepository,
} from '../data/repositories.js';
import { ClassDTO, mapToClassDTO } from '../interfaces/class.js';
import { getClassStudents } from './class.js';
import {mapToQuestionDTO, mapToQuestionId, QuestionDTO, QuestionId} from '../interfaces/question.js';
import { mapToTeacher, mapToTeacherDTO, TeacherDTO } from '../interfaces/teacher.js';
import {ConflictException, NotFoundException} from "../exceptions";
import {Teacher} from "../entities/users/teacher.entity";
import {fetchStudent} from "./students";
import {ClassJoinRequest, ClassJoinRequestStatus} from "../entities/classes/class-join-request.entity";
import {mapToStudentRequestDTO, StudentRequestDTO} from "../interfaces/student-request";
import {TeacherRepository} from "../data/users/teacher-repository";
import {ClassRepository} from "../data/classes/class-repository";
import {Class} from "../entities/classes/class.entity";
import {StudentDTO} from "../interfaces/student";
import {LearningObjectRepository} from "../data/content/learning-object-repository";
import {LearningObject} from "../entities/content/learning-object.entity";
import {QuestionRepository} from "../data/questions/question-repository";
import {Question} from "../entities/questions/question.entity";
import {ClassJoinRequestRepository} from "../data/classes/class-join-request-repository";
import {Student} from "../entities/users/student.entity";

export async function getAllTeachers(full: boolean): Promise<TeacherDTO[] | string[]> {
    const teacherRepository: TeacherRepository = getTeacherRepository();
    const users: Teacher[] = await teacherRepository.findAll();

    if (full) {
        return users.map(mapToTeacherDTO);
    }
    return users.map((user) => user.username);
}

export async function fetchTeacher(username: string): Promise<Teacher> {
    const teacherRepository: TeacherRepository = getTeacherRepository();
    const user: Teacher | null = await teacherRepository.findByUsername(username);

    if (!user) {
        throw new NotFoundException("Teacher with username not found");
    }

    return user;
}

export async function getTeacher(username: string): Promise<TeacherDTO> {
    const user: Teacher = await fetchTeacher(username);
    return mapToTeacherDTO(user);
}

export async function createTeacher(userData: TeacherDTO): Promise<void> {
    const teacherRepository: TeacherRepository = getTeacherRepository();

    const newTeacher = mapToTeacher(userData);
    await teacherRepository.save(newTeacher, { preventOverwrite: true });
}

export async function deleteTeacher(username: string): Promise<void> {
    const teacherRepository: TeacherRepository = getTeacherRepository();

    await fetchTeacher(username); // throws error if it does not exist

    await teacherRepository.deleteByUsername(username);
}

async function fetchClassesByTeacher(username: string): Promise<ClassDTO[]> {
    const teacher: Teacher = await fetchTeacher(username);

    const classRepository: ClassRepository = getClassRepository();
    const classes: Class[] = await classRepository.findByTeacher(teacher);
    return classes.map(mapToClassDTO);
}

export async function getClassesByTeacher(username: string, full: boolean): Promise<ClassDTO[] | string[]> {
    const classes: ClassDTO[] = await fetchClassesByTeacher(username);

    if (full) {
        return classes;
    }
    return classes.map((cls) => cls.id);
}

export async function getStudentsByTeacher(username: string, full: boolean) {
    const classes: ClassDTO[] = await fetchClassesByTeacher(username);

    if (!classes || classes.length === 0){
        return [];
    }

    const classIds: string[] = classes.map((cls) => cls.id);

    const students: StudentDTO[] = (await Promise.all(classIds.map(async (id) => getClassStudents(id)))).flat();
    if (full) {
        return students;
    }
    return students.map((student) => student.username);
}

export async function getTeacherQuestions(username: string, full: boolean): Promise<QuestionDTO[] | QuestionId[]> {
    const teacher: Teacher = await fetchTeacher(username);

    // Find all learning objects that this teacher manages
    const learningObjectRepository: LearningObjectRepository = getLearningObjectRepository();
    const learningObjects: LearningObject[] = await learningObjectRepository.findAllByTeacher(teacher);

    if (!learningObjects || learningObjects.length === 0){
        return [];
    }

    // Fetch all questions related to these learning objects
    const questionRepository: QuestionRepository = getQuestionRepository();
    const questions: Question[] = await questionRepository.findAllByLearningObjects(learningObjects);
    const questionsDTO: QuestionDTO[] = questions.map(mapToQuestionDTO);

    if (full) {
        return questionsDTO;
    }

    return questionsDTO.map(mapToQuestionId);
}

export async function getJoinRequestsByClass( classId: string ): Promise<StudentRequestDTO[]> {
    const classRepository: ClassRepository = getClassRepository();
    const cls: Class | null = await classRepository.findById(classId);

    if (!cls) {
        throw new NotFoundException("Class with id not found");
    }

    const requestRepo: ClassJoinRequestRepository = getClassJoinRequestRepository();
    const requests: ClassJoinRequest[] = await requestRepo.findAllOpenRequestsTo(cls);
    return requests.map(mapToStudentRequestDTO);
}

export async function updateClassJoinRequestStatus( studentUsername: string, classId: string, accepted: boolean = true): Promise<void> {
    const requestRepo: ClassJoinRequestRepository = getClassJoinRequestRepository();
    const classRepo: ClassRepository = getClassRepository();

    const student: Student = await fetchStudent(studentUsername);
    const cls: Class | null = await classRepo.findById(classId);

    if (!cls) {
        throw new NotFoundException('Class not found');
    }

    const request: ClassJoinRequest | null = await requestRepo.findByStudentAndClass(student, cls);

    if (!request) {
        throw new NotFoundException('Join request not found');
    }

    request.status = accepted ? ClassJoinRequestStatus.Accepted : ClassJoinRequestStatus.Declined;

    await requestRepo.save(request);
}
