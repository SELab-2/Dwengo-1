import { getAnswerRepository, getQuestionRepository } from '../data/repositories.js';
import { mapToQuestionDTO, mapToQuestionId, QuestionDTO, QuestionId } from '../interfaces/question.js';
import { Question } from '../entities/questions/question.entity.js';
import { Answer } from '../entities/questions/answer.entity.js';
import { mapToAnswerDTO, mapToAnswerId } from '../interfaces/answer.js';
import { QuestionRepository } from '../data/questions/question-repository.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { mapToStudent } from '../interfaces/student.js';

export async function getAllQuestions(id: LearningObjectIdentifier, full: boolean): Promise<QuestionDTO[] | QuestionId[]> {
    const questionRepository: QuestionRepository = getQuestionRepository();
    const questions = await questionRepository.findAllQuestionsAboutLearningObject(id);

    if (!questions) {
        return [];
    }

    const questionsDTO: QuestionDTO[] = questions.map(mapToQuestionDTO);

    if (full) {
        return questionsDTO;
    }

    return questionsDTO.map(mapToQuestionId);
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

export async function getAnswersByQuestion(questionId: QuestionId, full: boolean) {
    const answerRepository = getAnswerRepository();
    const question = await fetchQuestion(questionId);

    if (!question) {
        return [];
    }

    const answers: Answer[] = await answerRepository.findAllAnswersToQuestion(question);

    if (!answers) {
        return [];
    }

    const answersDTO = answers.map(mapToAnswerDTO);

    if (full) {
        return answersDTO;
    }

    return answersDTO.map(mapToAnswerId);
}

export async function createQuestion(questionDTO: QuestionDTO) {
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

export async function deleteQuestion(questionId: QuestionId) {
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

    return question;
}
