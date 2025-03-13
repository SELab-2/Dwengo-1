import { Question } from '../entities/questions/question.entity.js';
import {mapToUserDTO, UserDTO} from "./user.js";
import {LearningObjectIdentifier} from "../entities/content/learning-object-identifier.js";
import {Teacher} from "../entities/users/teacher.entity";

export interface QuestionDTO {
    learningObjectIdentifier: LearningObjectIdentifier;
    sequenceNumber?: number;
    author: UserDTO;
    timestamp?: string;
    content: string;
}

/**
 * Convert a Question entity to a DTO format.
 */
export function mapToQuestionDTO(question: Question): QuestionDTO {
    const learningObjectIdentifier = {
        hruid: question.learningObjectHruid,
        language: question.learningObjectLanguage,
        version: question.learningObjectVersion
    }

    return {
        learningObjectIdentifier,
        sequenceNumber: question.sequenceNumber,
        author: question.author,
        timestamp: question.timestamp.toISOString(),
        content: question.content,
    };
}

export interface QuestionId {
    learningObjectIdentifier: LearningObjectIdentifier;
    sequenceNumber: number;
}

export function mapToQuestionId(question: QuestionDTO): QuestionId {
    return {
        learningObjectIdentifier: question.learningObjectIdentifier,
        sequenceNumber: question.sequenceNumber,
    };
}

export function mapToQuestion(questionDTO: QuestionDTO): Question {
    const question = new Question();
    question.author = mapToUserDTO<Teacher>(questionDTO.author);
    question.learningObjectHruid = questionDTO.learningObjectIdentifier.hruid;
    question.learningObjectLanguage = questionDTO.learningObjectIdentifier.language;
    question.learningObjectVersion = questionDTO.learningObjectIdentifier.version;
    question.content  = questionDTO.content;
    question.sequenceNumber = questionDTO.sequenceNumber;
    question.timestamp = questionDTO.timestamp;

    return question;
}
