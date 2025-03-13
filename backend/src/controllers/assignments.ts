import { Request, Response } from 'express';
import { createAssignment, getAllAssignments, getAssignment, getAssignmentsSubmissions } from '../services/assignments.js';
import { AssignmentDTO, mapToAssignment, mapToAssignmentDTO } from '../interfaces/assignment.js';
import { getAssignmentRepository, getClassRepository } from '../data/repositories.js';

// Typescript is annoy with with parameter forwarding from class.ts
interface AssignmentParams {
    classid: string;
    id: string;
}

export async function getAllAssignmentsHandler(
    req: Request<AssignmentParams>,
    res: Response
): Promise<void> {
    const classid = req.params.classid;
    const full = req.query.full === 'true';

    const assignments = await getAllAssignments(classid, full);

    res.json({
        assignments: assignments,
    });
}

export async function createAssignmentHandler(
    req: Request<AssignmentParams>,
    res: Response,
): Promise<void> {
    const classid = req.params.classid;
    const assignmentData = req.body as AssignmentDTO;

    if (!assignmentData.description 
        || !assignmentData.language 
        || !assignmentData.learningPath 
        || !assignmentData.title
    ) {
        res.status(400).json({
            error: 'Missing one or more required fields: title, description, learningPath, title',
        });
        return;
    }

    const assignment = createAssignment(classid, assignmentData);

    if (!assignment) {
        res.status(500).json({ error: "Could not create assignment "});
        return;
    }

    res.status(201).json({ assignment: assignment });
}

export async function getAssignmentHandler(
    req: Request<AssignmentParams>,
    res: Response
): Promise<void> {
    const id = +req.params.id;
    const classid = req.params.classid;

    if (isNaN(id)) {
        res.status(400).json({ error: 'Assignment id must be a number' });
        return;
    }

    const assignment = await getAssignment(classid, id);

    if (!assignment) {
        res.status(404).json({ error: 'Assignment not found' });
        return;
    }

    res.json(assignment);
}

export async function getAssignmentsSubmissionsHandler(
    req: Request<AssignmentParams>,
    res: Response,
): Promise<void> {
    const classid = req.params.classid;
    const assignmentNumber = +req.params.id;

    if (isNaN(assignmentNumber)) {
        res.status(400).json({ error: 'Assignment id must be a number' });
        return;
    }

    const submissions = await getAssignmentsSubmissions(classid, assignmentNumber);

    res.json({
        submissions: submissions,
    });
}
