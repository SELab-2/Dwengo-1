import type { QuestionDTO, QuestionId } from "@dwengo-1/common/interfaces/question";

export interface QuestionsResponse {
    questions: QuestionDTO[] | QuestionId[];
}
