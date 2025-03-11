import { Request, Response } from "express";
import { getSubmission } from "../services/submissions";
import { Language } from "../entities/content/language";

interface SubmissionParams {
    lohruid: string,
    submissionNumber: number;
}

export async function getSubmissionHandler(
    req: Request<SubmissionParams>,
    res: Response,
): Promise<void> {
    const lohruid = req.params.lohruid;
    const submissionNumber = req.params.submissionNumber;

    const submission = getSubmission(lohruid, Language.Dutch, '1', submissionNumber);

    if (!submission) {
        res.status(404).json({ error: 'Submission not found' });
        return;
    }

    res.json(submission);
}