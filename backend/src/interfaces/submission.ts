import { Submission } from '../entities/assignments/submission.entity.js';
import { mapToGroupDTOId } from './group.js';
import { mapToStudentDTO } from './student.js';
import { SubmissionDTO, SubmissionDTOId } from '@dwengo-1/common/interfaces/submission';
import { getSubmissionRepository } from '../data/repositories.js';
import { Student } from '../entities/users/student.entity.js';
import { Group } from '../entities/assignments/group.entity.js';

export function mapToSubmissionDTO(submission: Submission): SubmissionDTO {
    return {
        learningObjectIdentifier: {
            hruid: submission.learningObjectHruid,
            language: submission.learningObjectLanguage,
            version: submission.learningObjectVersion,
        },
        submissionNumber: submission.submissionNumber,
        submitter: mapToStudentDTO(submission.submitter),
        time: submission.submissionTime,
        group: submission.onBehalfOf ? mapToGroupDTOId(submission.onBehalfOf, submission.onBehalfOf.assignment.within) : undefined,
        content: submission.content,
    };
}

export function mapToSubmissionDTOId(submission: Submission): SubmissionDTOId {
    return {
        learningObjectHruid: submission.learningObjectHruid,
        learningObjectLanguage: submission.learningObjectLanguage,
        learningObjectVersion: submission.learningObjectVersion,

        submissionNumber: submission.submissionNumber,
    };
}

export function mapToSubmission(submissionDTO: SubmissionDTO, submitter: Student, onBehalfOf: Group): Submission {
    return getSubmissionRepository().create({
        learningObjectHruid: submissionDTO.learningObjectIdentifier.hruid,
        learningObjectLanguage: submissionDTO.learningObjectIdentifier.language,
        learningObjectVersion: submissionDTO.learningObjectIdentifier.version || 1,
        submitter: submitter,
        submissionTime: new Date(),
        content: submissionDTO.content,
        onBehalfOf: onBehalfOf,
    });
}
