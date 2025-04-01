import { getAnswerRepository, getQuestionRepository } from '../data/repositories.js';
import { mapToQuestionDTO, mapToQuestionDTOId, QuestionDTO, QuestionId } from '../interfaces/question.js';
import { Question } from '../entities/questions/question.entity.js';
import { Answer } from '../entities/questions/answer.entity.js';
import { AnswerDTO, AnswerId, mapToAnswerDTO, mapToAnswerDTOId } from '../interfaces/answer.js';
import { QuestionRepository } from '../data/questions/question-repository.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { mapToStudent } from '../interfaces/student.js';

export async function getAllQuestions(id: LearningObjectIdentifier, full: boolean): Promise<QuestionDTO[] | QuestionId[]> {
    const questionRepository: QuestionRepository = getQuestionRepository();
    const questions = await questionRepository.findAllQuestionsAboutLearningObject(id);

    if (!questions) {
        return [];
    }

    if (full) {
        return questions.map(mapToQuestionDTO);
    }

    return questions.map(mapToQuestionDTOId);
}

async function fetchQuestion(questionId: QuestionId): Promise<Question | null> {
    const questionRepository = getQuestionRepository();

    return await questionRepository.findOne({
        learningObjectHruid: questionId.learningObjectIdentifier.hruid,
        learningObjectLanguage: questionId.learningObjectIdentifier.language,
        learningObjectVersion: questionId.learningObjectIdentifier.version,
        sequenceNumber: questionId.sequenceNumber,
    });
}

export async function getQuestion(questionId: QuestionId): Promise<QuestionDTO | null> {
    const question = await fetchQuestion(questionId);

    if (!question) {
        return null;
    }

    return mapToQuestionDTO(question);
}

export async function getAnswersByQuestion(questionId: QuestionId, full: boolean): Promise<AnswerDTO[] | AnswerId[]> {
    const answerRepository = getAnswerRepository();
    const question = await fetchQuestion(questionId);

    if (!question) {
        return [];
    }

    const answers: Answer[] = await answerRepository.findAllAnswersToQuestion(question);

    if (!answers) {
        return [];
    }

    if (full) {
        return answers.map(mapToAnswerDTO);
    }

    return answers.map(mapToAnswerDTOId);
}

export async function createQuestion(questionDTO: QuestionDTO): Promise<QuestionDTO | null> {
    const questionRepository = getQuestionRepository();

    const author = mapToStudent(questionDTO.author);

    try {
        await questionRepository.createQuestion({
            loId: questionDTO.learningObjectIdentifier,
            author,
            content: questionDTO.content,
        });
    } catch (_) {
        return null;
    }

    return questionDTO;
}

export async function deleteQuestion(questionId: QuestionId): Promise<QuestionDTO | null> {
    const questionRepository = getQuestionRepository();

    const question = await fetchQuestion(questionId);

    if (!question) {
        return null;
    }

    try {
        await questionRepository.removeQuestionByLearningObjectAndSequenceNumber(questionId.learningObjectIdentifier, questionId.sequenceNumber);
    } catch (_) {
        return null;
    }

    return mapToQuestionDTO(question);
}
