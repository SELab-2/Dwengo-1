import { LearningObjectIdentifierDTO } from './learning-content';
import { StudentDTO } from './student';

export interface QuestionDTO {
    learningObjectIdentifier: LearningObjectIdentifierDTO;
    sequenceNumber?: number;
    author: StudentDTO;
    timestamp: string;
    content: string;
}

export interface QuestionData {
    author?: string;
    content: string;
}

export interface QuestionId {
    learningObjectIdentifier: LearningObjectIdentifierDTO;
    sequenceNumber: number;
}
