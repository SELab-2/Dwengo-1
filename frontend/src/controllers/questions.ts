import type {QuestionDTO, QuestionId} from "dwengo-1-common/src/interfaces/question";

export type QuestionsResponse = { questions: QuestionDTO[] | QuestionId[] }
