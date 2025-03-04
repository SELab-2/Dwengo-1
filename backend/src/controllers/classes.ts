import { Request, Response } from 'express';
import { getClass } from '../services/class';

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