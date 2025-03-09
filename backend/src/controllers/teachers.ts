import { Request, Response } from 'express';
import { TeacherUserService, TeacherService } from '../services/teachers.js';
import { ClassDTO } from '../interfaces/class.js';
import { StudentDTO } from '../interfaces/student.js';
import { QuestionDTO, QuestionId } from '../interfaces/question.js';
import {
    createUserHandler,
    deleteUserHandler,
    getAllUsersHandler,
    getUserHandler,
} from './users.js';
import { Teacher } from '../entities/users/teacher.entity.js';

export async function getAllTeachersHandler(
    req: Request,
    res: Response
): Promise<void> {
    await getAllUsersHandler<Teacher>(req, res, new TeacherUserService());
}

export async function getTeacherHandler(
    req: Request,
    res: Response
): Promise<void> {
    await getUserHandler<Teacher>(req, res, new TeacherUserService());
}

export async function createTeacherHandler(
    req: Request,
    res: Response
): Promise<void> {
    await createUserHandler<Teacher>(
        req,
        res,
        new TeacherUserService(),
        Teacher
    );
}

export async function deleteTeacherHandler(
    req: Request,
    res: Response
): Promise<void> {
    await deleteUserHandler<Teacher>(req, res, new TeacherUserService());
}

export async function getTeacherClassHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const username = req.params.username as string;
        const full = req.query.full === 'true';

        if (!username) {
            res.status(400).json({ error: 'Missing required field: username' });
            return;
        }

        const teacherService = new TeacherService();

        const classes: ClassDTO[] | string[] = full
            ? await teacherService.getClassesByTeacher(username)
            : await teacherService.getClassIdsByTeacher(username);

        res.status(201).json(classes);
    } catch (error) {
        console.error('Error fetching classes by teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getTeacherStudentHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const username = req.params.username as string;
        const full = req.query.full === 'true';

        if (!username) {
            res.status(400).json({ error: 'Missing required field: username' });
            return;
        }

        const teacherService = new TeacherService();

        const students: StudentDTO[] | string[] = full
            ? await teacherService.getStudentsByTeacher(username)
            : await teacherService.getStudentIdsByTeacher(username);

        res.status(201).json(students);
    } catch (error) {
        console.error('Error fetching students by teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getTeacherQuestionHandler(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const username = req.params.username as string;
        const full = req.query.full === 'true';

        if (!username) {
            res.status(400).json({ error: 'Missing required field: username' });
            return;
        }

        const teacherService = new TeacherService();

        const questions: QuestionDTO[] | QuestionId[] = full
            ? await teacherService.getQuestionsByTeacher(username)
            : await teacherService.getQuestionIdsByTeacher(username);

        res.status(201).json(questions);
    } catch (error) {
        console.error('Error fetching questions by teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
