import { AssignmentController, type AssignmentResponse, type AssignmentsResponse } from "@/controllers/assignments";
import type { QuestionsResponse } from "@/controllers/questions";
import type { SubmissionsResponse } from "@/controllers/submissions";
import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationReturnType,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { groupsQueryKey, invalidateAllGroupKeys } from "./groups";
import type { GroupsResponse } from "@/controllers/groups";
import type { AssignmentDTO } from "@dwengo-1/common/interfaces/assignment";
import type { QueryClient } from "@tanstack/react-query";
import { invalidateAllSubmissionKeys } from "./submissions";

type AssignmentsQueryKey = ["assignments", string, boolean];

function assignmentsQueryKey(classid: string, full: boolean): AssignmentsQueryKey {
    return ["assignments", classid, full];
}

type AssignmentQueryKey = ["assignment", string, number];

function assignmentQueryKey(classid: string, assignmentNumber: number): AssignmentQueryKey {
    return ["assignment", classid, assignmentNumber];
}

type AssignmentSubmissionsQueryKey = ["assignment-submissions", string, number, boolean];

function assignmentSubmissionsQueryKey(
    classid: string,
    assignmentNumber: number,
    full: boolean,
): AssignmentSubmissionsQueryKey {
    return ["assignment-submissions", classid, assignmentNumber, full];
}

type AssignmentQuestionsQueryKey = ["assignment-questions", string, number, boolean];

function assignmentQuestionsQueryKey(
    classid: string,
    assignmentNumber: number,
    full: boolean,
): AssignmentQuestionsQueryKey {
    return ["assignment-questions", classid, assignmentNumber, full];
}

export async function invalidateAllAssignmentKeys(
    queryClient: QueryClient,
    classid?: string,
    assignmentNumber?: number,
): Promise<void> {
    const keys = ["assignment", "assignment-submissions", "assignment-questions"];

    await Promise.all(
        keys.map(async (key) => {
            const queryKey = [key, classid, assignmentNumber].filter((arg) => arg !== undefined);
            return queryClient.invalidateQueries({ queryKey: queryKey });
        }),
    );

    await queryClient.invalidateQueries({ queryKey: ["assignments", classid].filter((arg) => arg !== undefined) });
}

function checkEnabled(
    classid: string | undefined,
    assignmentNumber: number | undefined,
    groupNumber: number | undefined,
): boolean {
    return Boolean(classid) && !isNaN(Number(groupNumber)) && !isNaN(Number(assignmentNumber));
}

interface Values {
    cid: string | undefined;
    an: number | undefined;
    gn: number | undefined;
    f: boolean;
}

function toValues(
    classid: MaybeRefOrGetter<string | undefined>,
    assignmentNumber: MaybeRefOrGetter<number | undefined>,
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean>,
): Values {
    return { cid: toValue(classid), an: toValue(assignmentNumber), gn: toValue(groupNumber), f: toValue(full) };
}

export function useAssignmentsQuery(
    classid: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<AssignmentsResponse, Error> {
    const { cid, f } = toValues(classid, 1, 1, full);

    return useQuery({
        queryKey: computed(() => assignmentsQueryKey(cid!, f)),
        queryFn: async () => new AssignmentController(cid!).getAll(f),
        enabled: () => checkEnabled(cid, 1, 1),
    });
}

export function useAssignmentQuery(
    classid: MaybeRefOrGetter<string | undefined>,
    assignmentNumber: MaybeRefOrGetter<number | undefined>,
): UseQueryReturnType<AssignmentResponse, Error> {
    const { cid, an } = toValues(classid, assignmentNumber, 1, true);

    return useQuery({
        queryKey: computed(() => assignmentQueryKey(cid!, an!)),
        queryFn: async () => new AssignmentController(cid!).getByNumber(an!),
        enabled: () => checkEnabled(cid, an, 1),
    });
}

export function useCreateAssignmentMutation(): UseMutationReturnType<
    AssignmentResponse,
    Error,
    { cid: string; data: Partial<AssignmentDTO> },
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cid, data }) => new AssignmentController(cid).createAssignment(data),
        onSuccess: async (_) => {
            await queryClient.invalidateQueries({ queryKey: ["assignments"] });
        },
    });
}

export function useDeleteAssignmentMutation(): UseMutationReturnType<
    AssignmentResponse,
    Error,
    { cid: string; an: number },
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cid, an }) => new AssignmentController(cid).deleteAssignment(an),
        onSuccess: async (response) => {
            const cid = response.assignment.within;
            const an = response.assignment.id;

            await invalidateAllAssignmentKeys(queryClient, cid, an);
            await invalidateAllGroupKeys(queryClient, cid, an);
            await invalidateAllSubmissionKeys(queryClient, undefined, undefined, undefined, cid, an);
        },
    });
}

export function useUpdateAssignmentMutation(): UseMutationReturnType<
    AssignmentResponse,
    Error,
    { cid: string; an: number; data: Partial<AssignmentDTO> },
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cid, an, data }) => new AssignmentController(cid).updateAssignment(an, data),
        onSuccess: async (response) => {
            const cid = response.assignment.within;
            const an = response.assignment.id;

            await invalidateAllGroupKeys(queryClient, cid, an);
            await queryClient.invalidateQueries({ queryKey: ["assignments"] });
        },
    });
}

export function useAssignmentSubmissionsQuery(
    classid: MaybeRefOrGetter<string | undefined>,
    assignmentNumber: MaybeRefOrGetter<number | undefined>,
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<SubmissionsResponse, Error> {
    const { cid, an, gn, f } = toValues(classid, assignmentNumber, groupNumber, full);

    return useQuery({
        queryKey: computed(() => assignmentSubmissionsQueryKey(cid!, an!, f)),
        queryFn: async () => new AssignmentController(cid!).getSubmissionsByGroup(an!, gn!, f),
        enabled: () => checkEnabled(cid, an, gn),
    });
}

export function useAssignmentQuestionsQuery(
    classid: MaybeRefOrGetter<string | undefined>,
    assignmentNumber: MaybeRefOrGetter<number | undefined>,
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<QuestionsResponse, Error> {
    const { cid, an, gn, f } = toValues(classid, assignmentNumber, groupNumber, full);

    return useQuery({
        queryKey: computed(() => assignmentQuestionsQueryKey(cid!, an!, f)),
        queryFn: async () => new AssignmentController(cid!).getQuestions(gn!, f),
        enabled: () => checkEnabled(cid, an, gn),
    });
}

export function useAssignmentGroupsQuery(
    classid: MaybeRefOrGetter<string | undefined>,
    assignmentNumber: MaybeRefOrGetter<number | undefined>,
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<GroupsResponse, Error> {
    const { cid, an, gn, f } = toValues(classid, assignmentNumber, groupNumber, full);

    return useQuery({
        queryKey: computed(() => groupsQueryKey(cid!, an!, f)),
        queryFn: async () => new AssignmentController(cid!).getQuestions(gn!, f),
        enabled: () => checkEnabled(cid, an, gn),
    });
}
