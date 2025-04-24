import { getAnswerRepository, getAssignmentRepository, getClassRepository, getGroupRepository, getQuestionRepository } from '../data/repositories.js';
import { mapToLearningObjectID, mapToQuestionDTO, mapToQuestionDTOId } from '../interfaces/question.js';
import { Question } from '../entities/questions/question.entity.js';
import { Answer } from '../entities/questions/answer.entity.js';
import { mapToAnswerDTO, mapToAnswerDTOId } from '../interfaces/answer.js';
import { QuestionRepository } from '../data/questions/question-repository.js';
import { LearningObjectIdentifier } from '../entities/content/learning-object-identifier.js';
import { QuestionData, QuestionDTO, QuestionId } from '@dwengo-1/common/interfaces/question';
import { AnswerDTO, AnswerId } from '@dwengo-1/common/interfaces/answer';
import { mapToAssignment } from '../interfaces/assignment.js';
import { AssignmentDTO } from '@dwengo-1/common/interfaces/assignment';
import { fetchStudent } from './students.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { FALLBACK_VERSION_NUM } from '../config.js';
import { fetchAssignment } from './assignments.js';

export async function getQuestionsAboutLearningObjectInAssignment(
    loId: LearningObjectIdentifier,
    classId: string,
    assignmentId: number,
    full: boolean,
    studentUsername?: string
): Promise<QuestionDTO[] | QuestionId[]> {
    const assignment = await getAssignmentRepository().findByClassIdAndAssignmentId(classId, assignmentId);

    const questions = await getQuestionRepository().findAllQuestionsAboutLearningObjectInAssignment(loId, assignment!, studentUsername);

    if (full) {
        return questions.map((q) => mapToQuestionDTO(q));
    }
    return questions.map((q) => mapToQuestionDTOId(q));
}

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

export async function createQuestion(loId: LearningObjectIdentifier, questionData: QuestionData): Promise<QuestionDTO> {
    const questionRepository = getQuestionRepository();
    const author = await fetchStudent(questionData.author!);
    const content = questionData.content;

    let assignment;

    if (typeof questionData.inGroup.assignment === 'number' && typeof questionData.inGroup.class === 'string') {
        assignment = await fetchAssignment(questionData.inGroup.class, questionData.inGroup.assignment);
    } else {
        // TODO check if necessary and no conflicts to delete this if
        const clazz = await getClassRepository().findById((questionData.inGroup.assignment as AssignmentDTO).within);
        assignment = mapToAssignment(questionData.inGroup.assignment as AssignmentDTO, clazz!);
    }

    const inGroup = await getGroupRepository().findByAssignmentAndGroupNumber(assignment, questionData.inGroup.groupNumber);

    const question = await questionRepository.createQuestion({
        loId,
        author,
        inGroup: inGroup!,
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
