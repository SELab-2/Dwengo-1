import type { QuestionDTO, QuestionId } from "@dwengo-1/interfaces/question";

export interface QuestionsResponse {
    questions: QuestionDTO[] | QuestionId[];
}
