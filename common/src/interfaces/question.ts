import { LearningObjectIdentifierDTO } from './learning-content';
import { StudentDTO } from './student';
import { GroupDTO } from './group';

export interface QuestionDTO {
    learningObjectIdentifier: LearningObjectIdentifierDTO;
    sequenceNumber?: number;
    author: StudentDTO;
    inGroup: GroupDTO;
    timestamp: string;
    content: string;
}

export interface QuestionData {
    author?: string;
    inGroup: GroupDTO;
    content: string;
}

export interface QuestionId {
    learningObjectIdentifier: LearningObjectIdentifierDTO;
    sequenceNumber: number;
}
