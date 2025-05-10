import type { AnswerData, AnswerDTO, AnswerId } from "@dwengo-1/common/interfaces/answer";
import { BaseController } from "@/controllers/base-controller.ts";
import type { QuestionId } from "@dwengo-1/common/interfaces/question";
import type { LearningObjectIdentifierDTO } from "@dwengo-1/common/interfaces/learning-content";

export interface AnswersResponse {
    answers: AnswerDTO[] | AnswerId[];
}

export interface AnswerResponse {
    answer: AnswerDTO;
}

export class AnswerController extends BaseController {
    loId: LearningObjectIdentifierDTO;
    sequenceNumber: number;

    constructor(questionId: QuestionId) {
        super(
            `learningObject/${questionId.learningObjectIdentifier.hruid}/:${questionId.learningObjectIdentifier.version}/questions/${questionId.sequenceNumber}/answers`,
        );
        this.loId = questionId.learningObjectIdentifier;
        this.sequenceNumber = questionId.sequenceNumber;
    }

    async getAll(full = true): Promise<AnswersResponse> {
        return this.get<AnswersResponse>("/", { lang: this.loId.language, full });
    }

    async getBy(seq: number): Promise<AnswerResponse> {
        return this.get<AnswerResponse>(`/${seq}`, { lang: this.loId.language });
    }

    async create(answerData: AnswerData): Promise<AnswerResponse> {
        return this.post<AnswerResponse>("/", answerData, { lang: this.loId.language });
    }

    async remove(seq: number): Promise<AnswerResponse> {
        return this.delete<AnswerResponse>(`/${seq}`, { lang: this.loId.language });
    }

    async update(seq: number, answerData: AnswerData): Promise<AnswerResponse> {
        return this.put<AnswerResponse>(`/${seq}`, answerData, { lang: this.loId.language });
    }
}
