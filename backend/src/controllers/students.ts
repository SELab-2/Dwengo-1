import { Request, Response } from 'express';
import {
    createStudent,
    deleteStudent,
    getAllStudents,
    getStudent,
    getStudentAssignments,
    getStudentClasses,
    getStudentGroups,
    getStudentSubmissions,
} from '../services/students.js';
import { StudentDTO } from '../interfaces/student.js';
import { getStudentRepository } from '../data/repositories.js';

// TODO: accept arguments (full, ...)
// TODO: endpoints
export async function getAllStudentsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';

    const students = await getAllStudents(full);

    if (!students) {
        res.status(404).json({ error: `Student not found.` });
        return;
    }

    res.json({ students: students });
}

export async function getStudentHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;

    if (!username) {
        res.status(400).json({ error: 'Missing required field: username' });
        return;
    }

    const user = await getStudent(username);

    if (!user) {
        res.status(404).json({
            error: `User with username '${username}' not found.`,
        });
        return;
    }

    res.json(user);
}

export async function createStudentHandler(req: Request, res: Response) {
    const userData = req.body as StudentDTO;

    if (!userData.username || !userData.firstName || !userData.lastName) {
        res.status(400).json({
            error: 'Missing required fields: username, firstName, lastName',
        });
        return;
    }

    const newUser = await createStudent(userData);

    if (!newUser) {
        res.status(500).json({
            error: 'Something went wrong while creating student'
        });
        return;
    }

    res.status(201).json(newUser);
}

export async function deleteStudentHandler(req: Request, res: Response) {
    const username = req.params.username;

    if (!username) {
        res.status(400).json({ error: 'Missing required field: username' });
        return;
    }

    const deletedUser = await deleteStudent(username);
    if (!deletedUser) {
        res.status(404).json({
            error: `User with username '${username}' not found.`,
        });
        return;
    }

    res.status(200).json(deletedUser);
}

export async function getStudentClassesHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.id;

    const classes = await getStudentClasses(username, full);

    res.json({
        classes: classes,
    });
}

// TODO
// Might not be fully correct depending on if
// A class has an assignment, that all students
// Have this assignment.
export async function getStudentAssignmentsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.id;

    const assignments = getStudentAssignments(username, full);

    res.json({
        assignments: assignments,
    });
}

export async function getStudentGroupsHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.id;

    const groups = await getStudentGroups(username, full);

    res.json({
        groups: groups,
    });
}

export async function getStudentSubmissionsHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.id;
    const full = req.query.full === 'true';

    const submissions = await getStudentSubmissions(username, full);

    res.json({
        submissions: submissions,
    });
}
