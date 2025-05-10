import { GroupDTO } from './group';
import { LearningObjectIdentifierDTO } from './learning-content';
import { StudentDTO } from './student';
import { Language } from '../util/language';

export interface SubmissionDTO {
    learningObjectIdentifier: LearningObjectIdentifierDTO;

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
