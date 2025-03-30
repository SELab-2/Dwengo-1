import { Request, Response } from 'express';
import {
    createClassJoinRequest,
    createStudent, deleteClassJoinRequest,
    deleteStudent,
    getAllStudents, getJoinRequestsByStudent,
    getStudent,
    getStudentAssignments,
    getStudentClasses,
    getStudentGroups, getStudentQuestions,
    getStudentSubmissions,
} from '../services/students.js';
import { StudentDTO } from '../interfaces/student.js';
import {requireFields} from "./error-helper";

export async function getAllStudentsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';

    const students: StudentDTO[] | string[] = await getAllStudents(full);

    res.json({ students });
}

export async function getStudentHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    requireFields({ username });

    const student = await getStudent(username);

    res.status(201).json({ student });
}

export async function createStudentHandler(req: Request, res: Response) {
    const username = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    requireFields({ username, firstName, lastName });

    const userData = req.body as StudentDTO;

    await createStudent(userData);
    res.status(201);
}

export async function deleteStudentHandler(req: Request, res: Response) {
    const username = req.params.username;
    requireFields({ username });

    await deleteStudent(username);
    res.status(200);
}

export async function getStudentClassesHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.username;
    requireFields({ username });

    const classes = await getStudentClasses(username, full);

    res.json({
        classes,
    });
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

    res.json({
        assignments,
    });
}

export async function getStudentGroupsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.username;
    requireFields({ username });

    const groups = await getStudentGroups(username, full);

    res.json({
        groups,
    });
}

export async function getStudentSubmissionsHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const full = req.query.full === 'true';
    requireFields({ username });

    const submissions = await getStudentSubmissions(username, full);

    res.json({
        submissions,
    });
}

export async function getStudentQuestionsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.username;
    requireFields({ username });

    const questions = await getStudentQuestions(username, full);

    res.json({
        questions,
    });
}

export async function createStudentRequestHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const classId = req.body.classId;
    requireFields({ username, classId });

    await createClassJoinRequest(username, classId);
    res.status(201);
}

export async function getStudentRequestHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    requireFields({ username });

    const requests = await getJoinRequestsByStudent(username);
    res.status(201).json({ requests })
}

export async function deleteClassJoinRequestHandler(req: Request, res: Response) {
    const username = req.params.username as string;
    const classId = req.params.classId;
    requireFields({ username, classId });

    await deleteClassJoinRequest(username, classId);
    res.status(204);
}


