import { Request, Response } from 'express';
import { createSubmission, deleteSubmission, getAllSubmissions, getSubmission } from '../services/submissions.js';
import { BadRequestException } from '../exceptions/bad-request-exception.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { Language, languageMap } from '@dwengo-1/common/util/language';
import { SubmissionDTO } from '@dwengo-1/common/interfaces/submission';



export async function getSubmissionHandler(req: Request, res: Response): Promise<void> {
    const submissionNumber = +req.params.id;
    
    if (isNaN(submissionNumber)) {
        throw new BadRequestException('Submission number must be a number');
    }
    
    const lohruid = req.params.hruid;
    const lang = languageMap[req.query.language as string] || Language.Dutch;
    const version = (req.query.version || 1) as number;

    const loId = new LearningObjectIdentifier(lohruid, lang, version);

    const submission = await getSubmission(loId, submissionNumber);

    res.json({ submission });
}

export async function getAllSubmissionsHandler(req: Request, res: Response): Promise<void> {
    const lohruid = req.params.hruid;
    const lang = languageMap[req.query.language as string] || Language.Dutch;
    const version = (req.query.version || 1) as number;

    const loId = new LearningObjectIdentifier(lohruid, lang, version);

    const submissions = await getAllSubmissions(loId);

    res.json({ submissions });
}

export async function createSubmissionHandler(req: Request, res: Response): Promise<void> {
    const submissionDTO = req.body as SubmissionDTO;

    const submission = await createSubmission(submissionDTO);

    if (!submission) {
        res.status(400).json({ error: 'Failed to create submission' });
        return;
    }

    res.json({ submission });
}

export async function deleteSubmissionHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const submissionNumber = Number(req.params.id);

    const lang = languageMap[req.query.language as string] || Language.Dutch;
    const version = (req.query.version || 1) as number;

    const loId = new LearningObjectIdentifier(hruid, lang, version);

    const submission = await deleteSubmission(loId, submissionNumber);

    if (!submission) {
        throw new NotFoundException('Could not delete submission');
    }

    res.json({ submission });
}
