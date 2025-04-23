import { computed, type MaybeRefOrGetter, toValue } from "vue";
import {
    useMutation,
    type UseMutationReturnType,
    useQuery,
    type UseQueryReturnType,
    useQueryClient,
} from "@tanstack/vue-query";
import { AnswerController, type AnswerResponse, type AnswersResponse } from "@/controllers/answers.ts";
import type { AnswerData } from "@dwengo-1/common/interfaces/answer";
import type { QuestionId } from "@dwengo-1/common/interfaces/question";

/** 🔑 Query keys */
export function answersQueryKey(
    questionId: QuestionId,
    full: boolean,
): [string, string, number, string, number, boolean] {
    const loId = questionId.learningObjectIdentifier;
    return ["answers", loId.hruid, loId.version!, loId.language, questionId.sequenceNumber, full];
}
export function answerQueryKey(
    questionId: QuestionId,
    sequenceNumber: number,
): [string, string, number, string, number, number] {
    const loId = questionId.learningObjectIdentifier;
    return ["answer", loId.hruid, loId.version!, loId.language, questionId.sequenceNumber, sequenceNumber];
}

export function useAnswersQuery(
    questionId: MaybeRefOrGetter<QuestionId>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<AnswersResponse, Error> {
    return useQuery({
        queryKey: computed(() => answersQueryKey(toValue(questionId), toValue(full))),
        queryFn: async () => new AnswerController(toValue(questionId)).getAll(toValue(full)),
        enabled: () => Boolean(toValue(questionId)),
    });
}

export function useAnswerQuery(
    questionId: MaybeRefOrGetter<QuestionId>,
    sequenceNumber: MaybeRefOrGetter<number>,
): UseQueryReturnType<AnswerResponse, Error> {
    return useQuery({
        queryKey: computed(() => answerQueryKey(toValue(questionId), toValue(sequenceNumber))),
        queryFn: async () => new AnswerController(toValue(questionId)).getBy(toValue(sequenceNumber)),
        enabled: () => Boolean(toValue(questionId)) && Boolean(toValue(sequenceNumber)),
    });
}

export function useCreateAnswerMutation(
    questionId: MaybeRefOrGetter<QuestionId>,
): UseMutationReturnType<AnswerResponse, Error, AnswerData, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => new AnswerController(toValue(questionId)).create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: answersQueryKey(toValue(questionId), true),
            });
            await queryClient.invalidateQueries({
                queryKey: answersQueryKey(toValue(questionId), false),
            });
        },
    });
}

export function useDeleteAnswerMutation(
    questionId: MaybeRefOrGetter<QuestionId>,
): UseMutationReturnType<AnswerResponse, Error, number, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (seq) => new AnswerController(toValue(questionId)).remove(seq),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: answersQueryKey(toValue(questionId), true),
            });
            await queryClient.invalidateQueries({
                queryKey: answersQueryKey(toValue(questionId), false),
            });
        },
    });
}

export function useUpdateAnswerMutation(
    questionId: MaybeRefOrGetter<QuestionId>,
): UseMutationReturnType<AnswerResponse, Error, { answerData: AnswerData; seq: number }, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ answerData, seq }) => new AnswerController(toValue(questionId)).update(seq, answerData),
        onSuccess: async (_, { seq }) => {
            await queryClient.invalidateQueries({
                queryKey: answerQueryKey(toValue(questionId), seq),
            });
            await queryClient.invalidateQueries({
                queryKey: answersQueryKey(toValue(questionId), true),
            });
            await queryClient.invalidateQueries({
                queryKey: answersQueryKey(toValue(questionId), true),
            });
            await queryClient.invalidateQueries({
                queryKey: answersQueryKey(toValue(questionId), false),
            });
        },
    });
}
