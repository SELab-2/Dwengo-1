import { QuestionDTO } from 'dwengo-1-backend/src/interfaces/question.js';
import { UserDTO } from './user';

export interface AnswerDTO {
    author: UserDTO;
    toQuestion: QuestionDTO;
    sequenceNumber: number;
    timestamp: string;
    content: string;
}

export interface AnswerId {
    author: string;
    toQuestion: QuestionId;
    sequenceNumber: number;
}
