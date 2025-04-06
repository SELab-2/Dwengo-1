import { getSubmissionRepository } from '../data/repositories.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { mapToSubmission, mapToSubmissionDTO } from '../interfaces/submission.js';
import { SubmissionDTO } from '@dwengo-1/common/interfaces/submission';
import { Language } from '@dwengo-1/common/util/language';

export async function getSubmission(
    loId: LearningObjectIdentifier,
    submissionNumber: number
): Promise<SubmissionDTO> {
    const submissionRepository = getSubmissionRepository();
    const submission = await submissionRepository.findSubmissionByLearningObjectAndSubmissionNumber(loId, submissionNumber);

    if (!submission) {
        throw new NotFoundException('Could not find submission');
    }

    return mapToSubmissionDTO(submission);
}

export async function getAllSubmissions(
    loId: LearningObjectIdentifier,
): Promise<SubmissionDTO[]> {
    const submissionRepository = getSubmissionRepository();
    const submissions = await submissionRepository.findByLearningObject(loId);

    return submissions.map(mapToSubmissionDTO);
}

export async function createSubmission(submissionDTO: SubmissionDTO): Promise<SubmissionDTO | null> {
    const submissionRepository = getSubmissionRepository();
    const submission = mapToSubmission(submissionDTO);

    try {
        const newSubmission = submissionRepository.create(submission);
        await submissionRepository.save(newSubmission);
    } catch (_) {
        return null;
    }

    return mapToSubmissionDTO(submission);
}

export async function deleteSubmission(loId: LearningObjectIdentifier, submissionNumber: number): Promise<SubmissionDTO> {
    const submissionRepository = getSubmissionRepository();

    const submission = await getSubmission(loId, submissionNumber);

    if (!submission) {
        throw new NotFoundException('Could not delete submission because it does not exist');
    }

    await submissionRepository.deleteSubmissionByLearningObjectAndSubmissionNumber(loId, submissionNumber);

    return submission;
}
