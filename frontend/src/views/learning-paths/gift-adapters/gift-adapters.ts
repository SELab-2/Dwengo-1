import { multipleChoiceQuestionAdapter } from "@/views/learning-paths/gift-adapters/multiple-choice-question-adapter.ts";
import { essayQuestionAdapter } from "@/views/learning-paths/gift-adapters/essay-question-adapter.ts";

export const giftAdapters = [multipleChoiceQuestionAdapter, essayQuestionAdapter];

export function getGiftAdapterForType(questionType: string): GiftAdapter | undefined {
    return giftAdapters.find((it) => it.questionType === questionType);
}
