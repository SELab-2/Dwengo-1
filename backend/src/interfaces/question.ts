import {Question} from "../entities/questions/question.entity";
import {Enum, PrimaryKey} from "@mikro-orm/core";
import {Language} from "../entities/content/language";

export interface QuestionDTO {
    learningObjectHruid: string;
    learningObjectLanguage: string;
    learningObjectVersion: string;
    sequenceNumber: number;
    authorUsername: string;
    timestamp: string;
    content: string;
    endpoints?: {
        classes: string;
        questions: string;
        invitations: string;
        groups: string;
    };
}

/**
 * Convert a Question entity to a DTO format.
 */
export function mapToQuestionDTO(question: Question): QuestionDTO {
    return {
        learningObjectHruid: question.learningObjectHruid,
        learningObjectLanguage: question.learningObjectLanguage,
        learningObjectVersion: question.learningObjectVersion,
        sequenceNumber: question.sequenceNumber,
        authorUsername: question.author.username,
        timestamp: question.timestamp.toISOString(),
        content: question.content,
    };
}

export interface QuestionId {
    learningObjectHruid: string,
    learningObjectLanguage: Language,
    learningObjectVersion: string,
    sequenceNumber: number
}
