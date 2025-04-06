import { Submission } from '../entities/assignments/submission.entity.js';
import { mapToGroupDTO } from './group.js';
import { mapToStudent, mapToStudentDTO } from './student.js';
import { SubmissionDTO, SubmissionDTOId } from '@dwengo-1/common/interfaces/submission';

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
        group: mapToGroupDTO(submission.onBehalfOf),
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

export function mapToSubmission(submissionDTO: SubmissionDTO): Submission {
    const submission = new Submission();
    submission.learningObjectHruid = submissionDTO.learningObjectIdentifier.hruid;
    submission.learningObjectLanguage = submissionDTO.learningObjectIdentifier.language;
    submission.learningObjectVersion = submissionDTO.learningObjectIdentifier.version!;
    // Submission.submissionNumber = submissionDTO.submissionNumber;
    submission.submitter = mapToStudent(submissionDTO.submitter);
    // Submission.submissionTime = submissionDTO.time;
    // Submission.onBehalfOf =  submissionDTO.group!;
    // TODO fix group
    submission.content = submissionDTO.content;

    return submission;
}
