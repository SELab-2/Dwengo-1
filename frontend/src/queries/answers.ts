import type { QuestionId } from "@dwengo-1/common/dist/interfaces/question.ts";
import { type MaybeRefOrGetter, toValue } from "vue";
import { useMutation, type UseMutationReturnType, useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import { AnswerController, type AnswerResponse, type AnswersResponse } from "@/controllers/answers.ts";
import type { AnswerData } from "@dwengo-1/common/dist/interfaces/answer.ts";

// TODO caching

export function useAnswersQuery(
    questionId: MaybeRefOrGetter<QuestionId>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<AnswersResponse, Error> {
    return useQuery({
        queryFn: async () => new AnswerController(toValue(questionId)).getAll(toValue(full)),
        enabled: () => Boolean(toValue(questionId)),
    });
}

export function useAnswerQuery(
    questionId: MaybeRefOrGetter<QuestionId>,
    sequenceNumber: MaybeRefOrGetter<number>,
): UseQueryReturnType<AnswerResponse, Error> {
    return useQuery({
        queryFn: async () => new AnswerController(toValue(questionId)).getBy(toValue(sequenceNumber)),
        enabled: () => Boolean(toValue(questionId)),
    });
}

export function useCreateAnswerMutation(
    questionId: MaybeRefOrGetter<QuestionId>,
): UseMutationReturnType<AnswerResponse, Error, AnswerData, unknown> {
    return useMutation({
        mutationFn: async (data) => new AnswerController(toValue(questionId)).create(data),
    });
}

export function useDeleteAnswerMutation(
    questionId: MaybeRefOrGetter<QuestionId>,
): UseMutationReturnType<AnswerResponse, Error, number, unknown> {
    return useMutation({
        mutationFn: async (seq) => new AnswerController(toValue(questionId)).remove(seq),
    });
}

export function useUpdateAnswerMutation(
    questionId: MaybeRefOrGetter<QuestionId>,
): UseMutationReturnType<AnswerResponse, Error, { answerData: AnswerData; seq: number }, unknown> {
    return useMutation({
        mutationFn: async (data, seq) => new AnswerController(toValue(questionId)).update(seq, data),
    });
}
