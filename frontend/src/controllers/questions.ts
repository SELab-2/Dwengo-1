import type { QuestionData, QuestionDTO, QuestionId } from "@dwengo-1/common/interfaces/question";
import { BaseController } from "@/controllers/base-controller.ts";
import type { LearningObjectIdentifierDTO } from "@dwengo-1/common/interfaces/learning-content";

export interface QuestionsResponse {
    questions: QuestionDTO[] | QuestionId[];
}

export interface QuestionResponse {
    question: QuestionDTO;
}

export class QuestionController extends BaseController {
    loId: LearningObjectIdentifierDTO;

    constructor(loId: LearningObjectIdentifierDTO) {
        super(`learningObject/${loId.hruid}/:${loId.version}/questions`);
        this.loId = loId;
    }

    async getAllGroup(classId: string, assignmentId: string, forStudent: string, full = true): Promise<QuestionsResponse> {
        return this.get<QuestionsResponse>("/", { lang: this.loId.language, full, classId, assignmentId, forStudent });
    }

    async getAll(full = true): Promise<QuestionsResponse> {
        return this.get<QuestionsResponse>("/", { lang: this.loId.language, full });
    }

    async getBy(sequenceNumber: number): Promise<QuestionResponse> {
        return this.get<QuestionResponse>(`/${sequenceNumber}`, { lang: this.loId.language });
    }

    async create(questionData: QuestionData): Promise<QuestionResponse> {
        return this.post<QuestionResponse>("/", questionData, { lang: this.loId.language });
    }

    async remove(sequenceNumber: number): Promise<QuestionResponse> {
        return this.delete<QuestionResponse>(`/${sequenceNumber}`, { lang: this.loId.language });
    }

    async update(sequenceNumber: number, questionData: QuestionData): Promise<QuestionResponse> {
        return this.put<QuestionResponse>(`/${sequenceNumber}`, questionData, { lang: this.loId.language });
    }
}
