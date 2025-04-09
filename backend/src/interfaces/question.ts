import { Question } from '../entities/questions/question.entity.js';
import { mapToStudentDTO } from './student.js';
import { QuestionDTO, QuestionId } from '@dwengo-1/common/interfaces/question';
import { LearningObjectIdentifier } from '@dwengo-1/common/interfaces/learning-content';
import { mapToGroupDTOId } from './group';
import { LearningObjectIdentifierDTO } from '@dwengo-1/common/interfaces/learning-content';

function getLearningObjectIdentifier(question: Question): LearningObjectIdentifierDTO {
    return {
        hruid: question.learningObjectHruid,
        language: question.learningObjectLanguage,
        version: question.learningObjectVersion,
    };
}

export function mapToLearningObjectID(loID: LearningObjectIdentifierDTO): LearningObjectIdentifier {
    return {
        hruid: loID.hruid,
        language: loID.language,
        version: loID.version ?? 1,
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
        inGroup: mapToGroupDTOId(question.inGroup),
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
