import { Submission } from "../entities/assignments/submission.entity";
import { Language } from "../entities/content/language";
import { GroupDTO, mapToGroupDTO } from "./group";
import { mapToStudentDTO, StudentDTO } from "./student";

export interface SubmissionDTO {
    learningObjectHruid: string,
    learningObjectLanguage: Language,
    learningObjectVersion: string,

    submissionNumber: number,
    submitter: StudentDTO | string,
    time: Date,
    group?: GroupDTO | string,
    content: string,
}

export function mapToSubmissionDTO(submission: Submission): SubmissionDTO {
    return {
        learningObjectHruid: submission.learningObjectHruid,
        learningObjectLanguage: submission.learningObjectLanguage,
        learningObjectVersion: submission.learningObjectVersion,

        submissionNumber: submission.submissionNumber,
        submitter: mapToStudentDTO(submission.submitter),
        time: submission.submissionTime,
        group: submission.onBehalfOf ? mapToGroupDTO(submission.onBehalfOf) : undefined,
        content: submission.content,
    }
}