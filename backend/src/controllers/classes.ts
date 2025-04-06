import { Request, Response } from 'express';
import {
    addClassStudent,
    addClassTeacher,
    createClass,
    deleteClass,
    deleteClassStudent,
    deleteClassTeacher,
    getAllClasses,
    getClass,
    getClassStudents,
    getClassTeacherInvitations,
    getClassTeachers,
    putClass
} from '../services/classes.js';
import { ClassDTO } from '@dwengo-1/common/interfaces/class';
import {requireFields} from "./error-helper";

export async function getAllClassesHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const classes = await getAllClasses(full);

    res.json({ classes });
}

export async function createClassHandler(req: Request, res: Response): Promise<void> {
    const displayName = req.body.displayName;
    requireFields({ displayName });

    const classData = req.body as ClassDTO;
    const cls = await createClass(classData);

    res.json({ class: cls });
}

export async function getClassHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    requireFields({ classId });

    const cls = await getClass(classId);

    res.json({ class: cls });
}

export async function putClassHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    requireFields({ classId });

    const newData = req.body as Partial<ClassDTO>;
    const cls = await putClass(classId, newData);

    res.json({ class: cls });
}

export async function deleteClassHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    const cls = await deleteClass(classId);

    res.json({ class: cls });
}

export async function getClassStudentsHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    const full = req.query.full === 'true';
    requireFields({ classId });

    const students = await getClassStudents(classId, full);

    res.json({ students });
}

export async function getClassTeachersHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    const full = req.query.full === 'true';
    requireFields({ classId });

    const teachers = await getClassTeachers(classId, full);

    res.json({ teachers });
}

export async function getTeacherInvitationsHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    const full = req.query.full === 'true';
    requireFields({ classId });

    const invitations = await getClassTeacherInvitations(classId, full);

    res.json({ invitations });
}

export async function deleteClassStudentHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    const username = req.params.username;
    requireFields({ classId, username });

    const cls = await deleteClassStudent(classId, username);

    res.json({ class: cls });
}

export async function deleteClassTeacherHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    const username = req.params.username;
    requireFields({ classId, username });

    const cls = await deleteClassTeacher(classId, username);

    res.json({ class: cls });
}

export async function addClassStudentHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    const username = req.body.username;
    requireFields({ classId, username });

    const cls = await addClassStudent(classId, username);

    res.json({ class: cls });
}

export async function addClassTeacherHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    const username = req.body.username;
    requireFields({ classId, username });

    const cls = await addClassTeacher(classId, username);

    res.json({ class: cls });
}
