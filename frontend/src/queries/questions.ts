import { QuestionController, type QuestionResponse, type QuestionsResponse } from "@/controllers/questions.ts";
import type { QuestionData, QuestionId } from "@dwengo-1/common/interfaces/question";
import type { LearningObjectIdentifierDTO } from "@dwengo-1/common/interfaces/learning-content";
import { computed, type MaybeRefOrGetter, toValue } from "vue";
import {
    useMutation,
    type UseMutationReturnType,
    useQuery,
    useQueryClient,
    type UseQueryReturnType,
} from "@tanstack/vue-query";

export function questionsQueryKey(
    loId: LearningObjectIdentifierDTO,
    full: boolean,
): [string, string, number, string, boolean] {
    return ["questions", loId.hruid, loId.version!, loId.language, full];
}

export function questionsGroupQueryKey(
    loId: LearningObjectIdentifierDTO,
    classId: string,
    assignmentId: string,
    student: string,
    full: boolean,
): [string, string, number, string, boolean] {
    return ["questions", loId.hruid, loId.version!, loId.language, full, classId, assignmentId, student];
}

export function questionQueryKey(questionId: QuestionId): [string, string, number, string, number] {
    const loId = questionId.learningObjectIdentifier;
    return ["question", loId.hruid, loId.version!, loId.language, questionId.sequenceNumber];
}

export function useQuestionsQuery(
    loId: MaybeRefOrGetter<LearningObjectIdentifierDTO>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<QuestionsResponse, Error> {
    return useQuery({
        queryKey: computed(() => questionsQueryKey(toValue(loId), toValue(full))),
        queryFn: async () => new QuestionController(toValue(loId)).getAll(toValue(full)),
        enabled: () => Boolean(toValue(loId)),
    });
}

export function useQuestionsGroupQuery(
    loId: MaybeRefOrGetter<LearningObjectIdentifierDTO>,
    classId: MaybeRefOrGetter<string>,
    assignmentId: MaybeRefOrGetter<string>,
    student: MaybeRefOrGetter<string>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<QuestionsResponse, Error> {
    return useQuery({
        queryKey: computed(() =>
            questionsGroupQueryKey(
                toValue(loId),
                toValue(full),
                toValue(classId),
                toValue(assignmentId),
                toValue(student),
            ),
        ),
        queryFn: async () =>
            new QuestionController(toValue(loId)).getAllGroup(
                toValue(classId),
                toValue(assignmentId),
                toValue(student),
                toValue(full),
            ),
        enabled: () => Boolean(toValue(loId)),
    });
}

export function useQuestionQuery(
    questionId: MaybeRefOrGetter<QuestionId>,
): UseQueryReturnType<QuestionResponse, Error> {
    const loId = toValue(questionId).learningObjectIdentifier;
    const sequenceNumber = toValue(questionId).sequenceNumber;
    return useQuery({
        queryKey: computed(() => questionQueryKey(toValue(questionId))),
        queryFn: async () => new QuestionController(loId).getBy(sequenceNumber),
        enabled: () => Boolean(toValue(questionId)),
    });
}

export function useCreateQuestionMutation(
    loId: MaybeRefOrGetter<LearningObjectIdentifierDTO>,
): UseMutationReturnType<QuestionResponse, Error, QuestionData, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => new QuestionController(toValue(loId)).create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: questionsQueryKey(toValue(loId), true) });
            await queryClient.invalidateQueries({ queryKey: questionsQueryKey(toValue(loId), false) });
            await queryClient.invalidateQueries({ queryKey: ["answers"] });
        },
    });
}

export function useUpdateQuestionMutation(
    questionId: MaybeRefOrGetter<QuestionId>,
): UseMutationReturnType<QuestionResponse, Error, QuestionData, unknown> {
    const queryClient = useQueryClient();
    const loId = toValue(questionId).learningObjectIdentifier;
    const sequenceNumber = toValue(questionId).sequenceNumber;

    return useMutation({
        mutationFn: async (data) => new QuestionController(loId).update(sequenceNumber, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: questionsQueryKey(toValue(loId), true) });
            await queryClient.invalidateQueries({ queryKey: questionsQueryKey(toValue(loId), false) });
            await queryClient.invalidateQueries({ queryKey: questionQueryKey(toValue(questionId)) });
        },
    });
}

export function useDeleteQuestionMutation(
    questionId: MaybeRefOrGetter<QuestionId>,
): UseMutationReturnType<QuestionResponse, Error, void, unknown> {
    const queryClient = useQueryClient();
    const loId = toValue(questionId).learningObjectIdentifier;
    const sequenceNumber = toValue(questionId).sequenceNumber;
    return useMutation({
        mutationFn: async () => new QuestionController(loId).remove(sequenceNumber),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: questionsQueryKey(toValue(loId), true) });
            await queryClient.invalidateQueries({ queryKey: questionsQueryKey(toValue(loId), false) });
            await queryClient.invalidateQueries({ queryKey: questionQueryKey(toValue(questionId)) });
            await queryClient.invalidateQueries({ queryKey: ["answers"] });
            await queryClient.invalidateQueries({ queryKey: ["answer"] });
        },
    });
}
