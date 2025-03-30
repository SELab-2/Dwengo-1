import { Request, Response } from 'express';
import {
    createTeacher,
    deleteTeacher,
    getAllTeachers,
    getClassesByTeacher, getJoinRequestsByClass,
    getStudentsByTeacher,
    getTeacher,
    getTeacherQuestions, updateClassJoinRequestStatus
} from '../services/teachers.js';
import { ClassDTO } from '../interfaces/class.js';
import { StudentDTO } from '../interfaces/student.js';
import { QuestionDTO, QuestionId } from '../interfaces/question.js';
import { TeacherDTO } from '../interfaces/teacher.js';
import {requireFields} from "./error-helper";

export async function getAllTeachersHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';

    const teachers: TeacherDTO[] | string[] = await getAllTeachers(full);

    res.json({ teachers });
}

export async function getTeacherHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    requireFields({ username });

    const teacher = await getTeacher(username);

    res.json({ teacher });
}

export async function createTeacherHandler(req: Request, res: Response) {
    const username = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    requireFields({ username, firstName, lastName });

    const userData = req.body as TeacherDTO;

    await createTeacher(userData);
    res.sendStatus(201);
}

export async function deleteTeacherHandler(req: Request, res: Response) {
    const username = req.params.username;
    requireFields({ username });

    await deleteTeacher(username);
    res.sendStatus(200);
}

export async function getTeacherClassHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username as string;
    const full = req.query.full === 'true';
    requireFields({ username });

    const classes: ClassDTO[] | string[] = await getClassesByTeacher(username, full);

    res.json({ classes });
}

export async function getTeacherStudentHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username as string;
    const full = req.query.full === 'true';
    requireFields({ username });

    const students: StudentDTO[] | string[] = await getStudentsByTeacher(username, full);

    res.json({ students });
}

export async function getTeacherQuestionHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username as string;
    const full = req.query.full === 'true';
    requireFields({ username });

    const questions: QuestionDTO[] | QuestionId[] = await getTeacherQuestions(username, full);

    res.json({ questions });
}

export async function getStudentJoinRequestHandler(req: Request, res: Response) {
    const username = req.query.username as string;
    const classId = req.params.classId;
    requireFields({ username, classId });

    const joinRequests = await getJoinRequestsByClass(classId);
    res.json({ joinRequests });
}

export async function updateStudentJoinRequestHandler(req: Request, res: Response) {
    const studentUsername = req.query.studentUsername as string;
    const classId = req.params.classId;
    const accepted = req.body.accepted !== 'false'; // default = true
    requireFields({ studentUsername, classId });

    await updateClassJoinRequestStatus(studentUsername, classId, accepted);
    res.sendStatus(200);
}
