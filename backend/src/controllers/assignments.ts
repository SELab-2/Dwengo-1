import { Request, Response } from 'express';
import {
    createAssignment,
    deleteAssignment,
    getAllAssignments,
    getAssignment,
    getAssignmentsQuestions,
    getAssignmentsSubmissions,
    putAssignment,
} from '../services/assignments.js';
import { AssignmentDTO } from '@dwengo-1/common/interfaces/assignment';
import { requireFields } from './error-helper.js';
import { BadRequestException } from '../exceptions/bad-request-exception.js';
import { FALLBACK_LANG } from '../config.js';

function getAssignmentParams(req: Request): { classid: string; assignmentNumber: number; full: boolean } {
    const classid = req.params.classid;
    const assignmentNumber = Number(req.params.id);
    const full = req.query.full === 'true';
    requireFields({ assignmentNumber, classid });

    if (isNaN(assignmentNumber)) {
        throw new BadRequestException('Assignment id should be a number');
    }

    return { classid, assignmentNumber, full };
}

export async function getAllAssignmentsHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.classid;
    const full = req.query.full === 'true';

    const assignments = await getAllAssignments(classId, full);

    res.json({ assignments });
}

export async function createAssignmentHandler(req: Request, res: Response): Promise<void> {
    const classid = req.params.classid;
    const description = req.body.description || '';
    const language = req.body.language || FALLBACK_LANG;
    const learningPath = req.body.learningPath || '';
    const title = req.body.title;

    requireFields({ title });

    const assignmentData = {
        description: description,
        language: language,
        learningPath: learningPath,
        title: title,
    } as AssignmentDTO;
    const assignment = await createAssignment(classid, assignmentData);

    res.json({ assignment });
}

export async function getAssignmentHandler(req: Request, res: Response): Promise<void> {
    const { classid, assignmentNumber } = getAssignmentParams(req);

    const assignment = await getAssignment(classid, assignmentNumber);

    res.json({ assignment });
}

export async function putAssignmentHandler(req: Request, res: Response): Promise<void> {
    const { classid, assignmentNumber } = getAssignmentParams(req);

    const assignmentData = req.body as Partial<AssignmentDTO>;
    const assignment = await putAssignment(classid, assignmentNumber, assignmentData);

    res.json({ assignment });
}

export async function deleteAssignmentHandler(req: Request, res: Response): Promise<void> {
    const { classid, assignmentNumber } = getAssignmentParams(req);

    const assignment = await deleteAssignment(classid, assignmentNumber);

    res.json({ assignment });
}

export async function getAssignmentsSubmissionsHandler(req: Request, res: Response): Promise<void> {
    const { classid, assignmentNumber, full } = getAssignmentParams(req);

    const submissions = await getAssignmentsSubmissions(classid, assignmentNumber, full);

    res.json({ submissions });
}

export async function getAssignmentQuestionsHandler(req: Request, res: Response): Promise<void> {
    const { classid, assignmentNumber, full } = getAssignmentParams(req);

    const questions = await getAssignmentsQuestions(classid, assignmentNumber, full);

    res.json({ questions });
}
