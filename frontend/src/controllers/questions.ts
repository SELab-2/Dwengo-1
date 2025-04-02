import type { QuestionDTO, QuestionId } from "dwengo-1-common/src/interfaces/question";

export interface QuestionsResponse {
    questions: QuestionDTO[] | QuestionId[];
}
