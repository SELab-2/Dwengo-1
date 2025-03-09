import { Request, Response } from 'express'
import { getAllAssignments, getAssignment } from '../services/assignments.js';

// typescript is annoy with with parameter forwarding from class.ts
interface AssignmentParams {
    classid: string;
    id: string;
}

export async function getAllAssignmentsHandler(
    req: Request<AssignmentParams>,
    res: Response,
): Promise<void> {
    const classid = req.params.classid;
    const full = req.query.full === 'true';

    const assignments = await getAllAssignments(classid, full);

    res.json({
        assignments: assignments,
    });
}

export async function getAssignmentHandler(
    req: Request<AssignmentParams>,
    res: Response,
): Promise<void> {
    const id = +req.params.id;
    const classid = req.params.classid;

    if (isNaN(id)) {
        res.status(400).json({ error: "Assignment id must be a number" });
        return;
    }

    const assignment = await getAssignment(classid, id);

    if (!assignment) {
        res.status(404).json({ error: "Assignment not found" });
        return;
    }

    res.json(assignment);
}
