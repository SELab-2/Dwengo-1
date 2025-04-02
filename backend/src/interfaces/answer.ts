import { mapToUserDTO } from './user.js';
import { mapToQuestionDTO, mapToQuestionDTOId } from './question.js';
import { Answer } from '../entities/questions/answer.entity.js';
import { AnswerDTO, AnswerId } from 'dwengo-1-common/src/interfaces/answer';

/**
 * Convert a Question entity to a DTO format.
 */
export function mapToAnswerDTO(answer: Answer): AnswerDTO {
    return {
        author: mapToUserDTO(answer.author),
        toQuestion: mapToQuestionDTO(answer.toQuestion),
        sequenceNumber: answer.sequenceNumber!,
        timestamp: answer.timestamp.toISOString(),
        content: answer.content,
    };
}

export function mapToAnswerDTOId(answer: Answer): AnswerId {
    return {
        author: answer.author.username,
        toQuestion: mapToQuestionDTOId(answer.toQuestion),
        sequenceNumber: answer.sequenceNumber!,
    };
}
