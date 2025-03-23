import { Request, Response } from 'express';
import {
    createTeacher,
    deleteTeacher,
    getAllTeachers,
    getClassesByTeacher,
    getClassIdsByTeacher,
    getQuestionIdsByTeacher,
    getQuestionsByTeacher,
    getStudentIdsByTeacher,
    getStudentsByTeacher,
    getTeacher,
} from '../services/teachers.js';
import { ClassDTO } from '../interfaces/class.js';
import { StudentDTO } from '../interfaces/student.js';
import { QuestionDTO, QuestionId } from '../interfaces/question.js';
import { TeacherDTO } from '../interfaces/teacher.js';
import { getLogger } from '../logging/initalize.js';

export async function getAllTeachersHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';

    const teachers: TeacherDTO[] | string[] = full ? await getAllTeachers() : await getAllTeachers();

    if (!teachers) {
        res.status(404).json({ error: `Teacher not found.` });
        return;
    }

    res.status(201).json(teachers);
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
            error: `User with username '${username}' not found.`,
        });
        return;
    }

    res.status(201).json(user);
}

export async function createTeacherHandler(req: Request, res: Response): Promise<void> {
    const userData = req.body as TeacherDTO;

    if (!userData.username || !userData.firstName || !userData.lastName) {
        res.status(400).json({
            error: 'Missing required fields: username, firstName, lastName',
        });
        return;
    }

    const newUser = await createTeacher(userData);
    res.status(201).json(newUser);
}

export async function deleteTeacherHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;

    if (!username) {
        res.status(400).json({ error: 'Missing required field: username' });
        return;
    }

    const deletedUser = await deleteTeacher(username);
    if (!deletedUser) {
        res.status(404).json({
            error: `User with username '${username}' not found.`,
        });
        return;
    }

    res.status(200).json(deletedUser);
}

export async function getTeacherClassHandler(req: Request, res: Response): Promise<void> {
    try {
        const username = req.params.username;
        const full = req.query.full === 'true';

        if (!username) {
            res.status(400).json({ error: 'Missing required field: username' });
            return;
        }

        const classes: ClassDTO[] | string[] = full ? await getClassesByTeacher(username) : await getClassIdsByTeacher(username);

        res.status(201).json(classes);
    } catch (error) {
        getLogger().error('Error fetching classes by teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getTeacherStudentHandler(req: Request, res: Response): Promise<void> {
    try {
        const username = req.params.username;
        const full = req.query.full === 'true';

        if (!username) {
            res.status(400).json({ error: 'Missing required field: username' });
            return;
        }

        const students: StudentDTO[] | string[] = full ? await getStudentsByTeacher(username) : await getStudentIdsByTeacher(username);

        res.status(201).json(students);
    } catch (error) {
        getLogger().error('Error fetching students by teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getTeacherQuestionHandler(req: Request, res: Response): Promise<void> {
    try {
        const username = req.params.username;
        const full = req.query.full === 'true';

        if (!username) {
            res.status(400).json({ error: 'Missing required field: username' });
            return;
        }

        const questions: QuestionDTO[] | QuestionId[] = full ? await getQuestionsByTeacher(username) : await getQuestionIdsByTeacher(username);

        res.status(201).json(questions);
    } catch (error) {
        getLogger().error('Error fetching questions by teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
