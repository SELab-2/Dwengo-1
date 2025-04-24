import { QuestionDTO, QuestionId } from './question';
import { TeacherDTO } from './teacher';

export interface AnswerDTO {
    author: TeacherDTO;
    toQuestion: QuestionDTO;
    sequenceNumber: number;
    timestamp: string;
    content: string;
}

export interface AnswerData {
    author: string;
    content: string;
}

export interface AnswerId {
    author: string;
    toQuestion: QuestionId;
    sequenceNumber: number;
}
