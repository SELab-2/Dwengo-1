import { Submission } from '../entities/assignments/submission.entity.js';
import { Language } from '../entities/content/language.js';
import { mapToGroupDTO } from './group.js';
import { mapToStudent, mapToStudentDTO, StudentDTO } from './student.js';
import { LearningObjectIdentifier } from './learning-content.js';
import { GroupDTO } from 'dwengo-1-common/src/interfaces/group';

export interface SubmissionDTO {
    learningObjectIdentifier: LearningObjectIdentifier;

    submissionNumber?: number;
    submitter: StudentDTO;
    time?: Date;
    group?: GroupDTO;
    content: string;
}

export interface SubmissionDTOId {
    learningObjectHruid: string;
    learningObjectLanguage: Language;
    learningObjectVersion: number;

    submissionNumber?: number;
}

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
        group: submission.onBehalfOf ? mapToGroupDTO(submission.onBehalfOf) : undefined,
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
