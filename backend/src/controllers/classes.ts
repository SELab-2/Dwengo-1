import { Request, Response } from 'express';
import { createClass, getAllClasses, getClass, getClassStudents, getClassStudentsIds, getClassTeacherInvitations } from '../services/classes.js';
import { ClassDTO } from '../interfaces/class.js';

export async function getAllClassesHandler(req: Request, res: Response): Promise<void> {
    const full = req.query.full === 'true';
    const classes = await getAllClasses(full);

    res.json({
        classes: classes,
    });
}

export async function createClassHandler(req: Request, res: Response): Promise<void> {
    const classData = req.body as ClassDTO;

    if (!classData.displayName) {
        res.status(400).json({
            error: 'Missing one or more required fields: displayName',
        });
        return;
    }

    const cls = await createClass(classData);

    if (!cls) {
        res.status(500).json({ error: 'Something went wrong while creating class' });
        return;
    }

    res.status(201).json(cls);
}

export async function getClassHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    const cls = await getClass(classId);

    if (!cls) {
        res.status(404).json({ error: 'Class not found' });
        return;
    }

    res.json(cls);
}

export async function getClassStudentsHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    const full = req.query.full === 'true';

    const students = full ? await getClassStudents(classId) : await getClassStudentsIds(classId);

    res.json({
        students: students,
    });
}

export async function getTeacherInvitationsHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.id;
    const full = req.query.full === 'true';

    const invitations = await getClassTeacherInvitations(classId, full);

    res.json({
        invitations: invitations,
    });
}
