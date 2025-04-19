import { Request, Response } from 'express';
import {
    createClassJoinRequest,
    createOrUpdateStudent,
    deleteClassJoinRequest,
    deleteStudent,
    getAllStudents,
    getJoinRequestByStudentClass,
    getJoinRequestsByStudent,
    getStudent,
    getStudentAssignments,
    getStudentClasses,
    getStudentGroups,
    getStudentQuestions,
    getStudentSubmissions,
} from '../services/students.js';
import { requireFields } from './error-helper.js';
import { StudentDTO } from '@dwengo-1/common/interfaces/student';

export async function getAllStudentsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';

    const students: StudentDTO[] | string[] = await getAllStudents(full);

    res.json({ students });
}

export async function getStudentHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    requireFields({ username });

    const student = await getStudent(username);

    res.json({ student });
}

export async function createStudentHandler(req: Request, res: Response): Promise<void> {
    const username = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    requireFields({ username, firstName, lastName });

    const userData = req.body as StudentDTO;

    const student = await createOrUpdateStudent(userData);
    res.json({ student });
}

export async function deleteStudentHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    requireFields({ username });

    const student = await deleteStudent(username);
    res.json({ student });
}

export async function getStudentClassesHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.username;
    requireFields({ username });

    const classes = await getStudentClasses(username, full);

    res.json({ classes });
}

// TODO
// Might not be fully correct depending on if
// A class has an assignment, that all students
// Have this assignment.
export async function getStudentAssignmentsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.username;
    requireFields({ username });

    const assignments = getStudentAssignments(username, full);

    res.json({ assignments });
}

export async function getStudentGroupsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.username;
    requireFields({ username });

    const groups = await getStudentGroups(username, full);

    res.json({ groups });
}

export async function getStudentSubmissionsHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const full = req.query.full === 'true';
    requireFields({ username });

    const submissions = await getStudentSubmissions(username, full);

    res.json({ submissions });
}

export async function getStudentQuestionsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.username;
    requireFields({ username });

    const questions = await getStudentQuestions(username, full);

    res.json({ questions });
}

export async function createStudentRequestHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const classId = req.body.classId;
    requireFields({ username, classId });

    const request = await createClassJoinRequest(username, classId);
    res.json({ request });
}

export async function getStudentRequestsHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    requireFields({ username });

    const requests = await getJoinRequestsByStudent(username);
    res.json({ requests });
}

export async function getStudentRequestHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const classId = req.params.classId;
    requireFields({ username, classId });

    const request = await getJoinRequestByStudentClass(username, classId);
    res.json({ request });
}

export async function deleteClassJoinRequestHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const classId = req.params.classId;
    requireFields({ username, classId });

    const request = await deleteClassJoinRequest(username, classId);
    res.json({ request });
}
