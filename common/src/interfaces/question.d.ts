import { StudentDTO } from './student';

export interface QuestionDTO {
    learningObjectIdentifier: LearningObjectIdentifier;
    sequenceNumber?: number;
    author: StudentDTO;
    timestamp?: string;
    content: string;
}

export interface QuestionId {
    learningObjectIdentifier: LearningObjectIdentifier;
    sequenceNumber: number;
}
