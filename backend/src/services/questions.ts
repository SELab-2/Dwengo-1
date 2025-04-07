import { getQuestionRepository } from '../data/repositories.js';
import { mapToLearningObjectID, mapToQuestionDTO, mapToQuestionDTOId } from '../interfaces/question.js';
import { Question } from '../entities/questions/question.entity.js';
import { QuestionRepository } from '../data/questions/question-repository.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { QuestionData, QuestionDTO, QuestionId } from '@dwengo-1/common/interfaces/question';
import { NotFoundException } from '../exceptions/not-found-exception';
import { FALLBACK_VERSION_NUM } from '../config';
import { fetchStudent } from './students';

export async function getAllQuestions(id: LearningObjectIdentifier, full: boolean): Promise<QuestionDTO[] | QuestionId[]> {
    const questionRepository: QuestionRepository = getQuestionRepository();
    const questions = await questionRepository.findAllQuestionsAboutLearningObject(id);

    if (full) {
        return questions.map(mapToQuestionDTO);
    }

    return questions.map(mapToQuestionDTOId);
}

export async function fetchQuestion(questionId: QuestionId): Promise<Question> {
    const questionRepository = getQuestionRepository();
    const question = await questionRepository.findByLearningObjectAndSequenceNumber(
        mapToLearningObjectID(questionId.learningObjectIdentifier),
        questionId.sequenceNumber
    );

    if (!question) {
        throw new NotFoundException('Question with loID and sequence number not found');
    }

    return question;
}

export async function getQuestion(questionId: QuestionId): Promise<QuestionDTO> {
    const question = await fetchQuestion(questionId);
    return mapToQuestionDTO(question);
}

export async function createQuestion(loId: LearningObjectIdentifier, questionData: QuestionData): Promise<QuestionDTO> {
    const questionRepository = getQuestionRepository();
    const author = await fetchStudent(questionData.author!);
    const content = questionData.content;

    const question = await questionRepository.createQuestion({
        loId,
        author,
        content,
    });

    return mapToQuestionDTO(question);
}

export async function deleteQuestion(questionId: QuestionId): Promise<QuestionDTO> {
    const questionRepository = getQuestionRepository();
    const question = await fetchQuestion(questionId); // Throws error if not found

    const loId: LearningObjectIdentifier = {
        hruid: questionId.learningObjectIdentifier.hruid,
        language: questionId.learningObjectIdentifier.language,
        version: questionId.learningObjectIdentifier.version || FALLBACK_VERSION_NUM,
    };

    await questionRepository.removeQuestionByLearningObjectAndSequenceNumber(loId, questionId.sequenceNumber);
    return mapToQuestionDTO(question);
}

export async function updateQuestion(questionId: QuestionId, questionData: QuestionData): Promise<QuestionDTO> {
    const questionRepository = getQuestionRepository();
    const question = await fetchQuestion(questionId);

    const newQuestion = await questionRepository.updateContent(question, questionData.content);
    return mapToQuestionDTO(newQuestion);
}
