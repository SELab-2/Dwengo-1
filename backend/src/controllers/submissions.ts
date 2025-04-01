import { Request, Response } from 'express';
import { createSubmission, deleteSubmission, getSubmission } from '../services/submissions.js';

import { SubmissionDTO } from 'dwengo-1-common/src/interfaces/submission';
import { Language, languageMap } from 'dwengo-1-common/src/util/language.js';

interface SubmissionParams {
    hruid: string;
    id: number;
}

export async function getSubmissionHandler(req: Request<SubmissionParams>, res: Response): Promise<void> {
    const lohruid = req.params.hruid;
    const submissionNumber = Number(req.params.id);

    if (isNaN(submissionNumber)) {
        res.status(400).json({ error: 'Submission number is not a number' });
        return;
    }

    const lang = languageMap[req.query.language as string] || Language.Dutch;
    const version = (req.query.version || 1) as number;

    const submission = await getSubmission(lohruid, lang, version, submissionNumber);

    if (!submission) {
        res.status(404).json({ error: 'Submission not found' });
        return;
    }

    res.json(submission);
}

export async function createSubmissionHandler(req: Request, res: Response): Promise<void> {
    const submissionDTO = req.body as SubmissionDTO;

    const submission = await createSubmission(submissionDTO);

    if (!submission) {
        res.status(400).json({ error: 'Failed to create submission' });
        return;
    }

    res.json(submission);
}

export async function deleteSubmissionHandler(req: Request, res: Response): Promise<void> {
    const hruid = req.params.hruid;
    const submissionNumber = Number(req.params.id);

    const lang = languageMap[req.query.language as string] || Language.Dutch;
    const version = (req.query.version || 1) as number;

    const submission = await deleteSubmission(hruid, lang, version, submissionNumber);

    if (!submission) {
        res.status(404).json({ error: 'Submission not found' });
        return;
    }

    res.json(submission);
}
