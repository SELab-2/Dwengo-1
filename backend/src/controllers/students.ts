import { Request, Response } from 'express';
import {
    getStudentClasses,
    getStudentClassIds,
    StudentService
} from '../services/students.js';
import { ClassDTO } from '../interfaces/classes.js';
import { getAllAssignments } from '../services/assignments.js';
import {createUserHandler, deleteUserHandler, getAllUsersHandler, getUserHandler} from "./users.js";
import { Student } from "../entities/users/student.entity.js";

// TODO: accept arguments (full, ...)
// TODO: endpoints
export async function getAllStudentsHandler (req: Request, res: Response): Promise<void> {
    await getAllUsersHandler<Student>(req, res, new StudentService());
}

export async function getStudentHandler(req: Request, res: Response): Promise<void> {
    await getUserHandler<Student>(req, res, new StudentService());
}

export async function createStudentHandler(req: Request, res: Response): Promise<void> {
    await createUserHandler<Student>(req, res, new StudentService(), Student);
}

export async function deleteStudentHandler(req: Request, res: Response): Promise<void> {
    await deleteUserHandler<Student>(req, res, new StudentService());
}


export async function getStudentClassesHandler (
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const full = req.query.full === 'true';
        const username = req.params.id;

        let classes: ClassDTO[] | string[];
        if (full) classes = await getStudentClasses(username);
        else classes = await getStudentClassIds(username);

        res.json({
            classes: classes,
            endpoints: {
                self: `${req.baseUrl}/${req.params.id}`,
                classes: `${req.baseUrl}/${req.params.id}/invitations`,
                questions: `${req.baseUrl}/${req.params.id}/assignments`,
                students: `${req.baseUrl}/${req.params.id}/students`,
            }
        });
    } catch (error) {
        console.error('Error fetching learning objects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// TODO
// Might not be fully correct depending on if
// a class has an assignment, that all students
// have this assignment.
export async function getStudentAssignmentsHandler(
    req: Request,
    res: Response,
): Promise<void> {
    const full = req.query.full === 'true';
    const username = req.params.id;

    const classes = await getStudentClasses(username);

    const assignments = (await Promise.all(classes.map(async cls => await getAllAssignments(cls.id, full)))).flat();

    res.json({
        assignments: assignments
    });
}


