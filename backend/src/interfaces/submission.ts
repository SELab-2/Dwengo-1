import { Submission } from "../entities/assignments/submission.entity.js";
import { Language } from "../entities/content/language.js";
import { GroupDTO, mapToGroupDTO } from "./group.js";
import { mapToStudentDTO, StudentDTO } from "./student.js";

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
