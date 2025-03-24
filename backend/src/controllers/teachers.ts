import { Request, Response } from 'express';
import { createTeacher, deleteTeacher, getAllTeachers, getClassesByTeacher, getStudentsByTeacher, getTeacher } from '../services/teachers.js';
import { ClassDTO } from '../interfaces/class.js';
import { StudentDTO } from '../interfaces/student.js';
import { QuestionDTO, QuestionId } from '../interfaces/question.js';
import { TeacherDTO } from '../interfaces/teacher.js';
import { MISSING_FIELDS_ERROR, MISSING_USERNAME_ERROR, NAME_NOT_FOUND_ERROR } from './users';

export async function getAllTeachersHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';

    const teachers: TeacherDTO[] | string[] = await getAllTeachers(full);

    if (!teachers) {
        res.status(404).json({ error: `Teachers not found.` });
        return;
    }

    res.json({ teachers });
}

export async function getTeacherHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;

    if (!username) {
        res.status(400).json(MISSING_USERNAME_ERROR);
        return;
    }

    const user = await getTeacher(username);

    if (!user) {
        res.status(404).json(NAME_NOT_FOUND_ERROR(username));
        return;
    }

    res.status(201).json(user);
}

export async function createTeacherHandler(req: Request, res: Response) {
    const userData = req.body as TeacherDTO;

    if (!userData.username || !userData.firstName || !userData.lastName) {
        res.status(400).json(MISSING_FIELDS_ERROR);
        return;
    }

    const newUser = await createTeacher(userData);
    res.status(201).json(newUser);
}

export async function deleteTeacherHandler(req: Request, res: Response) {
    const username = req.params.username;

    if (!username) {
        res.status(400).json(MISSING_USERNAME_ERROR);
        return;
    }

    const deletedUser = await deleteTeacher(username);
    if (!deletedUser) {
        res.status(404).json(NAME_NOT_FOUND_ERROR(username));
        return;
    }

    res.status(200).json(deletedUser);
}

export async function getTeacherClassHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username as string;
    const full = req.query.full === 'true';

    if (!username) {
        res.status(400).json(MISSING_USERNAME_ERROR);
        return;
    }

    const classes: ClassDTO[] | string[] = await getClassesByTeacher(username, full);

    res.status(201).json(classes);
}

export async function getTeacherStudentHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username as string;
    const full = req.query.full === 'true';

    if (!username) {
        res.status(400).json(MISSING_USERNAME_ERROR);
        return;
    }

    const students: StudentDTO[] | string[] = await getStudentsByTeacher(username, full);

    res.json({ students });
}

export async function getTeacherQuestionHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username as string;
    const full = req.query.full === 'true';

    if (!username) {
        res.status(400).json(MISSING_USERNAME_ERROR);
        return;
    }

    const questions: QuestionDTO[] | QuestionId[] = await getQuestionsByTeacher(username, full);

    res.json({ questions });
}
