import { Submission } from '../entities/assignments/submission.entity.js';
import { mapToGroupDTO } from './group.js';
import { mapToStudentDTO } from './student.js';
import { SubmissionDTO, SubmissionDTOId } from '@dwengo-1/common/interfaces/submission';
import {getSubmissionRepository} from "../data/repositories";
import {Student} from "../entities/users/student.entity";
import {Group} from "../entities/assignments/group.entity";

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

export function mapToSubmission(submissionDTO: SubmissionDTO, submitter: Student, onBehalfOf: Group | undefined): Submission {
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
