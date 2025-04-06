import { getAnswerRepository, getQuestionRepository } from '../data/repositories.js';
import {mapToLearningObjectID, mapToQuestionDTO, mapToQuestionDTOId} from '../interfaces/question.js';
import { Question } from '../entities/questions/question.entity.js';
import { Answer } from '../entities/questions/answer.entity.js';
import { mapToAnswerDTO, mapToAnswerDTOId } from '../interfaces/answer.js';
import { QuestionRepository } from '../data/questions/question-repository.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { QuestionDTO, QuestionId } from '@dwengo-1/common/interfaces/question';
import { AnswerDTO, AnswerId } from '@dwengo-1/common/interfaces/answer';
import {NotFoundException} from "../exceptions/not-found-exception";
import {fetchStudent} from "./students";

export async function getAllQuestions(id: LearningObjectIdentifier, full: boolean): Promise<QuestionDTO[] | QuestionId[]> {
    const questionRepository: QuestionRepository = getQuestionRepository();
    const questions = await questionRepository.findAllQuestionsAboutLearningObject(id);

    if (full) {
        return questions.map(mapToQuestionDTO);
    }

    return questions.map(mapToQuestionDTOId);
}

async function fetchQuestion(questionId: QuestionId): Promise<Question> {
    const questionRepository = getQuestionRepository();
    const question = await questionRepository.findByLearningObjectAndSequenceNumber(
        mapToLearningObjectID(questionId.learningObjectIdentifier),
        questionId.sequenceNumber
    );

    if (!question){
        throw new NotFoundException('Question with loID and sequence number not found');
    }

    return question;
}

export async function getQuestion(questionId: QuestionId): Promise<QuestionDTO> {
    const question = await fetchQuestion(questionId);
    return mapToQuestionDTO(question);
}

export async function getAnswersByQuestion(questionId: QuestionId, full: boolean): Promise<AnswerDTO[] | AnswerId[]> {
    const answerRepository = getAnswerRepository();
    const question = await fetchQuestion(questionId);

    const answers: Answer[] = await answerRepository.findAllAnswersToQuestion(question);

    if (full) {
        return answers.map(mapToAnswerDTO);
    }

    return answers.map(mapToAnswerDTOId);
}

export async function createQuestion(questionDTO: QuestionDTO): Promise<QuestionDTO | null> {
    const questionRepository = getQuestionRepository();
    const author = await fetchStudent(questionDTO.author);

    await questionRepository.createQuestion({
        loId: mapToLearningObjectID(questionDTO.learningObjectIdentifier),
        author,
        content: questionDTO.content,
    });

    return questionDTO;
}

export async function deleteQuestion(questionId: QuestionId): Promise<QuestionDTO | null> {
    const questionRepository = getQuestionRepository();

    const question = await fetchQuestion(questionId);

    const loId: LearningObjectIdentifier = {
        ...questionId.learningObjectIdentifier,
        version: questionId.learningObjectIdentifier.version ?? 1,
    };

    await questionRepository.removeQuestionByLearningObjectAndSequenceNumber(loId, questionId.sequenceNumber);
    return mapToQuestionDTO(question);
}
