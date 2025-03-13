import { getSubmissionRepository } from "../data/repositories.js";
import { Language } from "../entities/content/language.js";
import { LearningObjectIdentifier } from "../entities/content/learning-object-identifier.js";
import { mapToSubmissionDTO, SubmissionDTO } from "../interfaces/submission.js";

export async function getSubmission(
    learningObjectHruid: string,
    language: Language,
    version: string,
    submissionNumber: number,
): Promise<SubmissionDTO | null> {
    const loId = new LearningObjectIdentifier(learningObjectHruid, language, version);

    const submissionRepository = getSubmissionRepository();
    const submission = await submissionRepository.findSubmissionByLearningObjectAndSubmissionNumber(loId, submissionNumber);

    if (!submission) {
        return null;
    }

    return mapToSubmissionDTO(submission);
}
