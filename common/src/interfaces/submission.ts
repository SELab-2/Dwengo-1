import { GroupDTO } from './group';
import { LearningObjectIdentifier } from './learning-content';
import { StudentDTO } from './student';
import { Language } from '../util/language';

export interface SubmissionDTO {
    learningObjectIdentifier: LearningObjectIdentifier;

    submissionNumber?: number;
    submitter: StudentDTO;
    time?: Date;
    group: GroupDTO;
    content: string;
}

export interface SubmissionDTOId {
    learningObjectHruid: string;
    learningObjectLanguage: Language;
    learningObjectVersion: number;

    submissionNumber?: number;
}
