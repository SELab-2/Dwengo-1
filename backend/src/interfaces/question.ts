import { Question } from '../entities/questions/question.entity.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { mapToStudentDTO, StudentDTO } from './student.js';

export interface QuestionDTO {
    learningObjectIdentifier: LearningObjectIdentifier;
    sequenceNumber?: number;
    author: StudentDTO;
    timestamp?: string;
    content: string;
}

function getLearningObjectIdentifier(question: Question): LearningObjectIdentifier {
    return {
        hruid: question.learningObjectHruid,
        language: question.learningObjectLanguage,
        version: question.learningObjectVersion,
    };
}

/**
 * Convert a Question entity to a DTO format.
 */
export function mapToQuestionDTO(question: Question): QuestionDTO {
    const learningObjectIdentifier = getLearningObjectIdentifier(question);

    return {
        learningObjectIdentifier,
        sequenceNumber: question.sequenceNumber!,
        author: mapToStudentDTO(question.author),
        timestamp: question.timestamp.toISOString(),
        content: question.content,
    };
}

export interface QuestionId {
    learningObjectIdentifier: LearningObjectIdentifier;
    sequenceNumber: number;
}

export function mapToQuestionDTOId(question: Question): QuestionId {
    const learningObjectIdentifier = getLearningObjectIdentifier(question);

    return {
        learningObjectIdentifier,
        sequenceNumber: question.sequenceNumber!,
    };
}
