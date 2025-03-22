import { getSubmissionRepository } from '../data/repositories.js';
import { Language } from '../entities/content/language.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { mapToSubmission, mapToSubmissionDTO, SubmissionDTO } from '../interfaces/submission.js';

export async function getSubmission(
    learningObjectHruid: string,
    language: Language,
    version: number,
    submissionNumber: number
): Promise<SubmissionDTO | null> {
    const loId = new LearningObjectIdentifier(learningObjectHruid, language, version);

    const submissionRepository = getSubmissionRepository();
    const submission = await submissionRepository.findSubmissionByLearningObjectAndSubmissionNumber(loId, submissionNumber);

    if (!submission) {
        return null;
    }

    return mapToSubmissionDTO(submission);
}

export async function createSubmission(submissionDTO: SubmissionDTO) {
    const submissionRepository = getSubmissionRepository();
    const submission = mapToSubmission(submissionDTO);

    try {
        const newSubmission = await submissionRepository.create(submission);
        await submissionRepository.save(newSubmission);
    } catch (_) {
        return null;
    }

    return submission;
}

export async function deleteSubmission(learningObjectHruid: string, language: Language, version: number, submissionNumber: number) {
    const submissionRepository = getSubmissionRepository();

    const submission = getSubmission(learningObjectHruid, language, version, submissionNumber);

    if (!submission) {
        return null;
    }

    const loId = new LearningObjectIdentifier(learningObjectHruid, language, version);
    await submissionRepository.deleteSubmissionByLearningObjectAndSubmissionNumber(loId, submissionNumber);

    return submission;
}
