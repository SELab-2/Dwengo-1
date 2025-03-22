import { Request, Response } from 'express';
import {
    createTeacher,
    deleteTeacher,
    getAllTeachers,
    getClassesByTeacher,
    getQuestionsByTeacher,
    getStudentsByTeacher,
    getTeacher,
} from '../services/teachers.js';
import { TeacherDTO } from '../interfaces/teacher.js';
import { getTeacherRepository } from '../data/repositories.js';

export async function getAllTeachersHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';

    const teachers = await getAllTeachers(full);

    if (!teachers) {
        res.status(404).json({ error: `Teacher not found.` });
        return;
    }

    res.json({ teachers: teachers });
}

export async function getTeacherHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;

    if (!username) {
        res.status(400).json({ error: 'Missing required field: username' });
        return;
    }

    const user = await getTeacher(username);

    if (!user) {
        res.status(404).json({
            error: `Teacher '${username}' not found.`,
        });
        return;
    }

    res.json(user);
}

export async function createTeacherHandler(req: Request, res: Response) {
    const userData = req.body as TeacherDTO;

    if (!userData.username || !userData.firstName || !userData.lastName) {
        res.status(400).json({
            error: 'Missing required fields: username, firstName, lastName',
        });
        return;
    }

    const newUser = await createTeacher(userData);

    if (!newUser) {
        res.status(400).json({ error: 'Failed to create teacher' });
        return;
    }

    res.status(201).json(newUser);
}

export async function deleteTeacherHandler(req: Request, res: Response) {
    const username = req.params.username;

    if (!username) {
        res.status(400).json({ error: 'Missing required field: username' });
        return;
    }

    const deletedUser = await deleteTeacher(username);
    if (!deletedUser) {
        res.status(404).json({
            error: `User '${username}' not found.`,
        });
        return;
    }

    res.status(200).json(deletedUser);
}

export async function getTeacherClassHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username as string;
    const full = req.query.full === 'true';

    if (!username) {
        res.status(400).json({ error: 'Missing required field: username' });
        return;
    }

    const classes = await getClassesByTeacher(username, full);

    res.json({ classes: classes });
}

export async function getTeacherStudentHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username as string;
    const full = req.query.full === 'true';

    if (!username) {
        res.status(400).json({ error: 'Missing required field: username' });
        return;
    }

    const students = await getStudentsByTeacher(username, full);

    res.json({ students: students });
}

export async function getTeacherQuestionHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username as string;
    const full = req.query.full === 'true';

    if (!username) {
        res.status(400).json({ error: 'Missing required field: username' });
        return;
    }

    const questions = await getQuestionsByTeacher(username, full);

    res.json({ questions: questions });
}
