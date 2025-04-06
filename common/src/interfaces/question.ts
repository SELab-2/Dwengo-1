import { LearningObjectIdentifierDTO } from './learning-content';
import { StudentDTO } from './student';

export interface QuestionDTO {
    learningObjectIdentifier: LearningObjectIdentifierDTO;
    sequenceNumber?: number;
    author: StudentDTO | string;
    timestamp?: string;
    content: string;
}

export interface QuestionId {
    learningObjectIdentifier: LearningObjectIdentifierDTO;
    sequenceNumber: number;
}
