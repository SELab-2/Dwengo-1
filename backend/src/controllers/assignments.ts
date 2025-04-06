import { Request, Response } from 'express';
import { createAssignment, getAllAssignments, getAssignment, getAssignmentsSubmissions } from '../services/assignments.js';
import { AssignmentDTO } from '@dwengo-1/common/interfaces/assignment';
import {requireFields} from "./error-helper";
import {BadRequestException} from "../exceptions/bad-request-exception";

// Typescript is annoying with parameter forwarding from class.ts
interface AssignmentParams {
    classid: string;
    id: string;
}

export async function getAllAssignmentsHandler(req: Request<AssignmentParams>, res: Response): Promise<void> {
    const classId = req.params.classid;
    const full = req.query.full === 'true';
    requireFields({ classId });

    const assignments = await getAllAssignments(classId, full);

    res.json({ assignments });
}

export async function createAssignmentHandler(req: Request<AssignmentParams>, res: Response): Promise<void> {
    const classid = req.params.classid;
    const description = req.body.description;
    const language = req.body.language;
    const learningPath = req.body.learningPath;
    const title = req.body.title;

    requireFields({ description, language, learningPath, title });
    const assignmentData = req.body as AssignmentDTO;

    const assignment = await createAssignment(classid, assignmentData);

    res.json({ assignment });
}

export async function getAssignmentHandler(req: Request<AssignmentParams>, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const classid = req.params.classid;
    requireFields({ id, classid });

    if (isNaN(id)) {
        throw new BadRequestException("Assignment id should be a number")
    }

    const assignment = await getAssignment(classid, id);

    res.json({ assignment });
}

export async function getAssignmentsSubmissionsHandler(req: Request<AssignmentParams>, res: Response): Promise<void> {
    const classid = req.params.classid;
    const assignmentNumber = Number(req.params.id);
    const full = req.query.full === 'true';
    requireFields({ assignmentNumber, classid });

    if (isNaN(assignmentNumber)) {
        throw new BadRequestException("Assignment id should be a number")
    }

    const submissions = await getAssignmentsSubmissions(classid, assignmentNumber, full);

    res.json({ submissions });
}
