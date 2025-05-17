import { Request, Response } from 'express';
import {
    createTeacher,
    deleteTeacher,
    getAllTeachers,
    getClassesByTeacher,
    getJoinRequestsByClass,
    getStudentsByTeacher,
    getTeacher,
    getTeacherAssignments,
    getTeacherQuestions,
    updateClassJoinRequestStatus,
} from '../services/teachers.js';
import { requireFields } from './error-helper.js';
import { TeacherDTO } from '@dwengo-1/common/interfaces/teacher';

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

export async function createTeacherHandler(req: Request, res: Response): Promise<void> {
    const username = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    requireFields({ username, firstName, lastName });

    const userData = req.body as TeacherDTO;

    const teacher = await createTeacher(userData);
    res.json({ teacher });
}

export async function deleteTeacherHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    requireFields({ username });

    const teacher = await deleteTeacher(username);
    res.json({ teacher });
}

export async function getTeacherClassHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const full = req.query.full === 'true';
    requireFields({ username });

    const classes = await getClassesByTeacher(username, full);

    res.json({ classes });
}

export async function getTeacherAssignmentsHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const full = req.query.full === 'true';
    requireFields({ username });

    const assignments = await getTeacherAssignments(username, full);

    res.json({ assignments });
}

export async function getTeacherStudentHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const full = req.query.full === 'true';
    requireFields({ username });

    const students = await getStudentsByTeacher(username, full);

    res.json({ students });
}

export async function getStudentJoinRequestHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.classId;
    requireFields({ classId });

    const joinRequests = await getJoinRequestsByClass(classId);
    res.json({ joinRequests });
}

export async function updateStudentJoinRequestHandler(req: Request, res: Response): Promise<void> {
    const studentUsername = req.params.studentUsername;
    const classId = req.params.classId;
    const accepted = req.body.accepted !== 'false'; // Default = true
    requireFields({ studentUsername, classId });

    const request = await updateClassJoinRequestStatus(studentUsername, classId, accepted);
    res.json({ request });
}
