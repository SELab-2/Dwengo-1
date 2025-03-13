import { Submission } from "../entities/assignments/submission.entity.js";
import { Language } from "../entities/content/language.js";
import { GroupDTO, mapToGroupDTO } from "./group.js";
import {mapToStudent, mapToStudentDTO, StudentDTO} from "./student.js";
import {mapToUser} from "./user";
import {Student} from "../entities/users/student.entity";

export interface SubmissionDTO {
    learningObjectHruid: string,
    learningObjectLanguage: Language,
    learningObjectVersion: number,

    submissionNumber?: number,
    submitter: StudentDTO,
    time?: Date,
    group?: GroupDTO,
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

export function mapToSubmission(submissionDTO: SubmissionDTO): Submission {
    const submission = new Submission();
    submission.learningObjectHruid = submissionDTO.learningObjectHruid;
    submission.learningObjectLanguage = submissionDTO.learningObjectLanguage;
    submission.learningObjectVersion = submissionDTO.learningObjectVersion;
    // Submission.submissionNumber = submissionDTO.submissionNumber;
    submission.submitter = mapToStudent(submissionDTO.submitter) ;
    // Submission.submissionTime = submissionDTO.time;
    // Submission.onBehalfOf =  submissionDTO.group!;
    // TODO fix group
    submission.content = submissionDTO.content;

    return submission;
}
