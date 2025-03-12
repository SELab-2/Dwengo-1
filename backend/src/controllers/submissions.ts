import { Request, Response } from "express";
import { getSubmission } from "../services/submissions";
import { Language, languageMap } from "../entities/content/language";

interface SubmissionParams {
    lohruid: string,
    submissionNumber: number;
}

export async function getSubmissionHandler(
    req: Request<SubmissionParams>,
    res: Response,
): Promise<void> {
    const lohruid = req.params.lohruid;
    const submissionNumber = +req.params.submissionNumber;

    if (isNaN(submissionNumber)) {
        res.status(404).json({ error: 'Submission number is not a number' });
        return;
    }

    let lang = languageMap[req.query.language as string] || Language.Dutch;
    let version = req.query.version as string || '1';

    const submission = getSubmission(lohruid, lang, version, submissionNumber);

    if (!submission) {
        res.status(404).json({ error: 'Submission not found' });
        return;
    }

    res.json(submission);
}