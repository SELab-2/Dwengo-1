import { getAssignmentRepository, getGroupRepository, getSubmissionRepository } from '../data/repositories.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { mapToSubmission, mapToSubmissionDTO } from '../interfaces/submission.js';
import { SubmissionDTO } from '@dwengo-1/common/interfaces/submission';
import { fetchStudent } from './students.js';
import { fetchGroup, getExistingGroupFromGroupDTO } from './groups.js';
import { Submission } from '../entities/assignments/submission.entity.js';
import { Language } from '@dwengo-1/common/util/language';
import { fetchAssignment } from './assignments.js';

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
    const group = await getExistingGroupFromGroupDTO(submissionDTO.group!);

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

/**
 * Returns all the submissions made by on behalf of any group the given student is in.
 */
export async function getSubmissionsForLearningObjectAndAssignment(
    learningObjectHruid: string,
    language: Language,
    version: number,
    classId: string,
    assignmentId: number,
    groupId?: number
): Promise<SubmissionDTO[]> {
    const loId = new LearningObjectIdentifier(learningObjectHruid, language, version);

    try {
        let submissions: Submission[];
        if (groupId !== undefined) {
            const group = await fetchGroup(classId, assignmentId, groupId);
            submissions = await getSubmissionRepository().findAllSubmissionsForLearningObjectAndGroup(loId, group);
        } else {
            const assignment = await fetchAssignment(classId, assignmentId);
            submissions = await getSubmissionRepository().findAllSubmissionsForLearningObjectAndAssignment(loId, assignment);
        }
        return submissions.map((s) => mapToSubmissionDTO(s));
    } catch(e) {
        return [];
    }
}
