import { GroupDTO } from './group';

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
