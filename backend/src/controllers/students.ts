import { Request, Response } from 'express';
import {
    getStudentAssignments,
    getStudentClasses,
    getStudentGroups,
    getStudentSubmissions,
    StudentService,
} from '../services/students.js';
import { ClassDTO } from '../interfaces/class.js';
import { getAllAssignments } from '../services/assignments.js';
import {
    createUserHandler,
    deleteUserHandler,
    getAllUsersHandler,
    getUserHandler,
} from './users.js';
import { Student } from '../entities/users/student.entity.js';

// TODO: accept arguments (full, ...)
// TODO: endpoints
export async function getAllStudentsHandler(
    req: Request,
    res: Response
): Promise<void> {
    await getAllUsersHandler<Student>(req, res, new StudentService());
}

export async function getStudentHandler(
    req: Request,
    res: Response
): Promise<void> {
    await getUserHandler<Student>(req, res, new StudentService());
}

export async function createStudentHandler(
    req: Request,
    res: Response
): Promise<void> {
    await createUserHandler<Student>(req, res, new StudentService(), Student);
}

export async function deleteStudentHandler(
    req: Request,
    res: Response
): Promise<void> {
    await deleteUserHandler<Student>(req, res, new StudentService());
}

export async function getStudentClassesHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const full = req.query.full === 'true';
        const username = req.params.id;

        const classes = await getStudentClasses(username, full);

        res.json({
            classes: classes,
            endpoints: {
                self: `${req.baseUrl}/${req.params.id}`,
                classes: `${req.baseUrl}/${req.params.id}/invitations`,
                questions: `${req.baseUrl}/${req.params.id}/assignments`,
                students: `${req.baseUrl}/${req.params.id}/students`,
            },
        });
    } catch (error) {
        console.error('Error fetching learning objects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// TODO
// Might not be fully correct depending on if
// A class has an assignment, that all students
// Have this assignment.
export async function getStudentAssignmentsHandler(
    req: Request,
    res: Response
): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.id;

    const assignments = getStudentAssignments(username, full);

    res.json({
        assignments: assignments,
    });
}

export async function getStudentGroupsHandler(
    req: Request,
    res: Response,
): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.id;

    const groups = await getStudentGroups(username, full);
    
    res.json({
        groups: groups,
    });
}

export async function getStudentSubmissionsHandler(
    req: Request,
    res: Response,
): Promise<void> {
    const username = req.params.id;

    const submissions = await getStudentSubmissions(username);

    res.json({
        submissions: submissions,
    });
}
