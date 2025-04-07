import type {QuestionData, QuestionDTO, QuestionId} from "@dwengo-1/common/interfaces/question";
import {BaseController} from "@/controllers/base-controller.ts";
import type {LearningObjectIdentifierDTO} from "@dwengo-1/common/interfaces/learning-content";

export interface QuestionsResponse {
    questions: QuestionDTO[] | QuestionId[];
}

export interface QuestionResponse {
    question: QuestionDTO;
}

export class QuestionController extends BaseController {
    constructor(loId: LearningObjectIdentifierDTO) {
        this.loId = loId;
        super(`learningObject/${loId.hruid}/:${loId.version}/questions`);
    }

    async getAll(full = true): Promise<QuestionsResponse> {
        return this.get<QuestionsResponse>("/", {lang: this.loId.lang, full});
    }

    async getBy(sequenceNumber: number): Promise<QuestionResponse> {
        return this.get<QuestionResponse>(`/${sequenceNumber}`, {lang: this.loId.lang});
    }

    async create(questionData: QuestionData): Promise<QuestionResponse> {
        return this.post<QuestionResponse>("/", questionData, {lang: this.loId.lang})
    }

    async remove(sequenceNumber: number) {
        return this.delete<QuestionResponse>(`/${sequenceNumber}`, {lang: this.loId.lang});
    }

    async update(sequenceNumber: number, questionData: QuestionData) {
        return this.put<QuestionResponse>(`/${sequenceNumber}`, questionData, {lang: this.loId.lang});
    }
}
