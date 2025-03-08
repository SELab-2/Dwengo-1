import { Request, Response } from 'express'
import { getAssignment } from '../services/assignments';

// typescript is annoywith with parameter forwarding from class.ts
interface AssignmentParams {
    classid: string;
    id: string;
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
