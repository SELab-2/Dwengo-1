import { LearningObjectIdentifier } from './learning-content';
import { StudentDTO } from './student';
import { GroupDTO } from './group';

export interface QuestionDTO {
    learningObjectIdentifier: LearningObjectIdentifier;
    sequenceNumber?: number;
    author: StudentDTO;
    inGroup: GroupDTO;
    timestamp?: string;
    content: string;
}

export interface QuestionId {
    learningObjectIdentifier: LearningObjectIdentifier;
    sequenceNumber: number;
}
