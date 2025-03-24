import { Request, Response } from 'express';
import {
    createStudent,
    deleteStudent,
    getAllStudents,
    getStudent,
    getStudentAssignments,
    getStudentClasses,
    getStudentGroups, getStudentQuestions,
    getStudentSubmissions,
} from '../services/students.js';
import {MISSING_FIELDS_ERROR, MISSING_USERNAME_ERROR, NAME_NOT_FOUND_ERROR} from './users.js';
import { StudentDTO } from '../interfaces/student.js';


export async function getAllStudentsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';

    const students: StudentDTO[] | string[] = await getAllStudents(full);

    if (!students) {
        res.status(404).json({ error: `Students not found.` });
        return;
    }

    res.json({students});
}

export async function getStudentHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;

    if (!username) {
        res.status(400).json(MISSING_USERNAME_ERROR);
        return;
    }

    const user = await getStudent(username);

    if (!user) {
        res.status(404).json(NAME_NOT_FOUND_ERROR(username));
        return;
    }

    res.status(201).json(user);
}

export async function createStudentHandler(req: Request, res: Response) {
    const userData = req.body as StudentDTO;

    if (!userData.username || !userData.firstName || !userData.lastName) {
        res.status(400).json(MISSING_FIELDS_ERROR);
        return;
    }

    const newUser = await createStudent(userData);
    res.status(201).json(newUser);
}

export async function deleteStudentHandler(req: Request, res: Response) {
    const username = req.params.username;

    if (!username) {
        res.status(400).json(MISSING_USERNAME_ERROR);
        return;
    }

    const deletedUser = await deleteStudent(username);
    if (!deletedUser) {
        res.status(404).json(NAME_NOT_FOUND_ERROR(username));
        return;
    }

    res.status(200).json(deletedUser);
}

export async function getStudentClassesHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.username;

    if (!username) {
        res.status(400).json(MISSING_USERNAME_ERROR);
        return;
    }

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

    if (!username) {
        res.status(400).json(MISSING_USERNAME_ERROR);
        return;
    }

    const assignments = getStudentAssignments(username, full);

    res.json({
        assignments,
    });
}

export async function getStudentGroupsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.username;

    if (!username) {
        res.status(400).json(MISSING_USERNAME_ERROR);
        return;
    }

    const groups = await getStudentGroups(username, full);

    res.json({
        groups,
    });
}

export async function getStudentSubmissionsHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;

    if (!username) {
        res.status(400).json(MISSING_USERNAME_ERROR);
        return;
    }

    const submissions = await getStudentSubmissions(username);

    res.json({
        submissions,
    });
}

export async function getStudentQuestionsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.username;

    if (!username) {
        res.status(400).json(MISSING_USERNAME_ERROR);
        return;
    }

    const questions = await getStudentQuestions(username, full);

    res.json({
        questions,
    })
}
