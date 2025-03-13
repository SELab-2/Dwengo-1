import {mapToUserDTO, UserDTO} from "./user.js";
import {mapToQuestionDTO, mapToQuestionId, QuestionDTO, QuestionId} from "./question.js";
import {Answer} from "../entities/questions/answer.entity.js";

export interface AnswerDTO {
    author: UserDTO;
    toQuestion: QuestionDTO;
    sequenceNumber: number;
    timestamp: string;
    content: string;
}

/**
 * Convert a Question entity to a DTO format.
 */
export function mapToAnswerDTO(answer: Answer): AnswerDTO {
    return {
        author: mapToUserDTO(answer.author),
        toQuestion: mapToQuestionDTO(answer.toQuestion),
        sequenceNumber: answer.sequenceNumber,
        timestamp: answer.timestamp.toISOString(),
        content: answer.content,
    };
}

export interface AnswerId {
    author: string;
    toQuestion: QuestionId;
    sequenceNumber: number;
}

export function mapToAnswerId(answer: AnswerDTO): AnswerId {
    return {
        author: answer.author.username,
        toQuestion: mapToQuestionId(answer.toQuestion),
        sequenceNumber: answer.sequenceNumber
    }
}
