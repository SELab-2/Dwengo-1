import { Request, Response } from 'express';
import { getStudent, getStudentClasses, getStudentClassIds } from '../services/students';
import { ClassDTO } from '../interfaces/classes';

export async function getAllStudentsHandler (
    req: Request,
    res: Response,
): Promise<void> {
    try {
        res.json({
            students: [
                '0',
                '1',
            ]
        });
    } catch (error) {
        console.error('Error fetching learning objects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getStudentHandler(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const username = req.params.id;
        const student = await getStudent(username);
    
        if (!student) {
            res.status(404).json({ error: "Student not found" });
            return;
        } else {
            student.endpoints = {
                classes: `/student/${req.params.id}/classes`,
                questions: `/student/${req.params.id}/submissions`,
                invitations: `/student/${req.params.id}/assignments`,
                groups: `/student/${req.params.id}/groups`,
            }
            res.json(student);
        }

    } catch (error) {
        console.error('Error fetching learning objects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
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