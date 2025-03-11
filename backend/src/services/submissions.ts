import { getSubmissionRepository } from "../data/repositories";
import { Language } from "../entities/content/language";
import { LearningObjectIdentifier } from "../entities/content/learning-object-identifier";
import { mapToSubmissionDTO, SubmissionDTO } from "../interfaces/submission";

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