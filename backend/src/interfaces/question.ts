import { Question } from '../entities/questions/question.entity.js';
import { mapToStudentDTO } from './student.js';
import { QuestionDTO, QuestionId } from '@dwengo-1/common/interfaces/question';
import { LearningObjectIdentifier } from '@dwengo-1/common/interfaces/learning-content';
import {mapToGroupDTO} from "./group";

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
        inGroup: mapToGroupDTO(question.inGroup),
        timestamp: question.timestamp.toISOString(),
        content: question.content,
    };
}

export function mapToQuestionDTOId(question: Question): QuestionId {
    const learningObjectIdentifier = getLearningObjectIdentifier(question);

    return {
        learningObjectIdentifier,
        sequenceNumber: question.sequenceNumber!,
    };
}
