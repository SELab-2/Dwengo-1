import { Request, Response } from 'express';
import { getStudentById } from "../services/students";

export async function getStudent(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const username = req.params.id;
        const student = await getStudentById(username);
    
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