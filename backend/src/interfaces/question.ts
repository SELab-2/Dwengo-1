import { Question } from '../entities/questions/question.entity.js';
import { mapToStudentDTO } from './student.js';
import { QuestionDTO, QuestionId } from '@dwengo-1/common/interfaces/question';

/**
 * Convert a Question entity to a DTO format.
 */
export function mapToQuestionDTO(question: Question): QuestionDTO {
    const learningObjectIdentifier = {
        hruid: question.learningObjectHruid,
        language: question.learningObjectLanguage,
        version: question.learningObjectVersion,
    };

    return {
        learningObjectIdentifier,
        sequenceNumber: question.sequenceNumber!,
        author: mapToStudentDTO(question.author),
        timestamp: question.timestamp.toISOString(),
        content: question.content,
    };
}

export function mapToQuestionId(question: QuestionDTO): QuestionId {
    return {
        learningObjectIdentifier: question.learningObjectIdentifier,
        sequenceNumber: question.sequenceNumber!,
    };
}
