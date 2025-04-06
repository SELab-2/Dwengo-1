import {getAnswerRepository} from "../data/repositories";
import {Answer} from "../entities/questions/answer.entity";
import {mapToAnswerDTO, mapToAnswerDTOId} from "../interfaces/answer";
import {fetchTeacher} from "./teachers";
import {fetchQuestion} from "./questions";
import {QuestionId} from "@dwengo-1/common/interfaces/question";
import {AnswerData, AnswerDTO, AnswerId} from "@dwengo-1/common/interfaces/answer";
import {NotFoundException} from "../exceptions/not-found-exception";

export async function getAnswersByQuestion(questionId: QuestionId, full: boolean): Promise<AnswerDTO[] | AnswerId[]> {
    const answerRepository = getAnswerRepository();
    const question = await fetchQuestion(questionId);

    const answers: Answer[] = await answerRepository.findAllAnswersToQuestion(question);

    if (full) {
        return answers.map(mapToAnswerDTO);
    }

    return answers.map(mapToAnswerDTOId);
}

export async function createAnswer(questionId: QuestionId, answerData: AnswerData): Promise<AnswerDTO> {
    const answerRepository = getAnswerRepository();
    const toQuestion = await fetchQuestion(questionId);
    const author = await fetchTeacher(answerData.author);
    const content = answerData.content;

    const answer = await answerRepository.createAnswer({
        toQuestion, author, content
    });
    return mapToAnswerDTO(answer);
}

async function fetchAnswer(questionId: QuestionId, sequenceNumber: number): Promise<Answer> {
    const answerRepository = getAnswerRepository();
    const question = await fetchQuestion(questionId);
    const answer = await answerRepository.findAnswer(question, sequenceNumber);

    if (!answer){
        throw new NotFoundException('Answer with questionID and sequence number not found');
    }

    return answer;
}

export async function getAnswer(questionId: QuestionId, sequenceNumber: number): Promise<AnswerDTO> {
    const answer = await fetchAnswer(questionId, sequenceNumber);
    return mapToAnswerDTO(answer);
}

export async function deleteAnswer(questionId: QuestionId, sequenceNumber: number): Promise<AnswerDTO> {
    const answerRepository = getAnswerRepository();

    const question = await fetchQuestion(questionId);
    const answer = await fetchAnswer(questionId, sequenceNumber);

    await answerRepository.removeAnswerByQuestionAndSequenceNumber(question, sequenceNumber);
    return mapToAnswerDTO(answer);
}

export async function updateAnswer(questionId: QuestionId, sequenceNumber: number, answerData: AnswerData){
    const answerRepository = getAnswerRepository();
    const answer = await fetchAnswer(questionId, sequenceNumber);

    const newAnswer = await answerRepository.updateContent(answer, answerData.content);
    return mapToAnswerDTO(newAnswer);
}
