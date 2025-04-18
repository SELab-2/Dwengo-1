import type { AnswerData, AnswerDTO, AnswerId } from "@dwengo-1/common/interfaces/answer";
import { BaseController } from "@/controllers/base-controller.ts";
import type { QuestionId } from "@dwengo-1/common/interfaces/question";

export interface AnswersResponse {
    answers: AnswerDTO[] | AnswerId[];
}

export interface AnswerResponse {
    answer: AnswerDTO;
}

export class AnswerController extends BaseController {
    constructor(questionId: QuestionId) {
        this.loId = questionId.learningObjectIdentifier;
        this.sequenceNumber = questionId.sequenceNumber;
        super(`learningObject/${loId.hruid}/:${loId.version}/questions/${this.sequenceNumber}/answers`);
    }

    async getAll(full = true): Promise<AnswersResponse> {
        return this.get<AnswersResponse>("/", { lang: this.loId.lang, full });
    }

    async getBy(seq: number): Promise<AnswerResponse> {
        return this.get<AnswerResponse>(`/${seq}`, { lang: this.loId.lang });
    }

    async create(answerData: AnswerData): Promise<AnswerResponse> {
        return this.post<AnswerResponse>("/", answerData, { lang: this.loId.lang });
    }

    async remove(seq: number): Promise<AnswerResponse> {
        return this.delete<AnswerResponse>(`/${seq}`, { lang: this.loId.lang });
    }

    async update(seq: number, answerData: AnswerData): Promise<AnswerResponse> {
        return this.put<AnswerResponse>(`/${seq}`, answerData, { lang: this.loId.lang });
    }
}
