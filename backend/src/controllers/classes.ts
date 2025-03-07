import { Request, Response } from 'express';
import {getAllClasses, getClass, getClassStudents, getClassStudentsIds} from '../services/class';
import { ClassDTO } from '../interfaces/classes';

export async function getAllClassesHandler(
    req: Request,
    res: Response,
): Promise<void> {
    const full = req.query.full === "true";
    const classes = await getAllClasses(full);

    res.json({
        classes: classes
    });
}

export async function getClassHandler(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const classId = req.params.id;
        const cls = await getClass(classId);

        if (!cls) {
            res.status(404).json({ error: "Student not found" });
            return;
        } else {
            cls.endpoints = {
                self: `${req.baseUrl}/${req.params.id}`,
                invitations: `${req.baseUrl}/${req.params.id}/invitations`,
                assignments: `${req.baseUrl}/${req.params.id}/assignments`,
                students: `${req.baseUrl}/${req.params.id}/students`,
            }

            res.json(cls);
        }
    } catch (error) {
        console.error('Error fetching learning objects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getClassStudentsHandler(
    req: Request,
    res: Response,
): Promise<void> {
    const classId = req.params.id;
    const full = req.query.full === "true";

    let students;

    if (full) students = await getClassStudents(classId);
    else students = await getClassStudentsIds(classId);

    res.json({
        students: students,
    });
}
