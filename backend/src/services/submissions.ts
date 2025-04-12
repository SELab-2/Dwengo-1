import { getSubmissionRepository } from '../data/repositories.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { mapToSubmission, mapToSubmissionDTO } from '../interfaces/submission.js';
import { SubmissionDTO } from '@dwengo-1/common/interfaces/submission';
import { fetchStudent } from './students.js';
import { getExistingGroupFromGroupDTO } from './groups.js';
import { Submission } from '../entities/assignments/submission.entity.js';

export async function fetchSubmission(loId: LearningObjectIdentifier, submissionNumber: number): Promise<Submission> {
    const submissionRepository = getSubmissionRepository();
    const submission = await submissionRepository.findSubmissionByLearningObjectAndSubmissionNumber(loId, submissionNumber);

    if (!submission) {
        throw new NotFoundException('Could not find submission');
    }

    return submission;
}

export async function getSubmission(loId: LearningObjectIdentifier, submissionNumber: number): Promise<SubmissionDTO> {
    const submission = await fetchSubmission(loId, submissionNumber);
    return mapToSubmissionDTO(submission);
}

export async function getAllSubmissions(loId: LearningObjectIdentifier): Promise<SubmissionDTO[]> {
    const submissionRepository = getSubmissionRepository();
    const submissions = await submissionRepository.findByLearningObject(loId);

    return submissions.map(mapToSubmissionDTO);
}

export async function createSubmission(submissionDTO: SubmissionDTO): Promise<SubmissionDTO> {
    const submitter = await fetchStudent(submissionDTO.submitter.username);
    // TODO: fix
    // const group = submissionDTO.group ? await getExistingGroupFromGroupDTO(submissionDTO.group) : undefined;
    const group = undefined;

    const submissionRepository = getSubmissionRepository();
    const submission = mapToSubmission(submissionDTO, submitter, group);
    await submissionRepository.save(submission);

    return mapToSubmissionDTO(submission);
}

export async function deleteSubmission(loId: LearningObjectIdentifier, submissionNumber: number): Promise<SubmissionDTO> {
    const submission = await fetchSubmission(loId, submissionNumber);

    const submissionRepository = getSubmissionRepository();
    await submissionRepository.deleteSubmissionByLearningObjectAndSubmissionNumber(loId, submissionNumber);

    return mapToSubmissionDTO(submission);
}
