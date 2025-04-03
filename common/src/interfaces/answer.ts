import { UserDTO } from './user';
import { QuestionDTO, QuestionId } from './question';

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
