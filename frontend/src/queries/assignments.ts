import { AssignmentController, type AssignmentResponse, type AssignmentsResponse } from "@/controllers/assignments";
import type { QuestionsResponse } from "@/controllers/questions";
import type { SubmissionsResponse } from "@/controllers/submissions";
import { useMutation, useQuery, useQueryClient, type UseMutationReturnType, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { groupsQueryKey } from "./groups";
import type { GroupsResponse } from "@/controllers/groups";
import type { AssignmentDTO } from "@dwengo-1/common/interfaces/assignment";

function assignmentsQueryKey(classid: string, full: boolean) {
    return [ "assignments", classid, full ];
}
function assignmentQueryKey(classid: string, assignmentNumber: number) {
    return [ "assignment", classid, assignmentNumber ];
}
function assignmentSubmissionsQueryKey(classid: string, assignmentNumber: number, full: boolean) {
    return [ "assignment-submissions", classid, assignmentNumber, full ];
}
function assignmentQuestionsQueryKey(classid: string, assignmentNumber: number, full: boolean) {
    return [ "assignment-questions", classid, assignmentNumber, full ];
}

function checkEnabled(
    classid: string | undefined, 
    assignmentNumber: number | undefined, 
    groupNumber: number | undefined,
): boolean {
    return  Boolean(classid) && !isNaN(Number(groupNumber)) && !isNaN(Number(assignmentNumber));
}
function toValues(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean>,
) {
    return { cid: toValue(classid), an: toValue(assignmentNumber), gn: toValue(groupNumber), f: toValue(full) };
}

export function useAssignmentsQuery(
    classid: MaybeRefOrGetter<string | undefined>, 
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<AssignmentsResponse, Error> {
    const { cid, f } = toValues(classid, 1, 1, full);

    return useQuery({
        queryKey: computed(() => (assignmentsQueryKey(cid!, f))),
        queryFn: async () => new AssignmentController(cid!).getAll(f),
        enabled: () => checkEnabled(cid, 1, 1),
    });
}

export function useAssignmentQuery(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
): UseQueryReturnType<AssignmentsResponse, Error> {
    const { cid, an } = toValues(classid, assignmentNumber, 1, true);

    return useQuery({
        queryKey: computed(() => assignmentQueryKey(cid!, an!)),
        queryFn: async () => new AssignmentController(cid!).getByNumber(an!),
        enabled: () => checkEnabled(cid, an, 1),
    });
}

export function useCreateAssignmentMutation(
    classid: MaybeRefOrGetter<string | undefined>, 
): UseMutationReturnType<AssignmentResponse, Error, AssignmentDTO, unknown> {
    const queryClient = useQueryClient();
    const { cid } = toValues(classid, 1, 1, true);

    return useMutation({
        mutationFn: async (data) => new AssignmentController(cid!).createAssignment(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: assignmentsQueryKey(cid!, true) });
            await queryClient.invalidateQueries({ queryKey: assignmentsQueryKey(cid!, false) });
        },
    });
}

export function useDeleteAssignmentMutation(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
): UseMutationReturnType<AssignmentResponse, Error, number, unknown> {
    const queryClient = useQueryClient();
    const { cid, an } = toValues(classid, assignmentNumber, 1, true);

    return useMutation({
        mutationFn: async (id) => new AssignmentController(cid!).deleteAssignment(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: assignmentQueryKey(cid!, an!) });

            await queryClient.invalidateQueries({ queryKey: assignmentsQueryKey(cid!, true) });
            await queryClient.invalidateQueries({ queryKey: assignmentsQueryKey(cid!, false) });

            await queryClient.invalidateQueries({ queryKey: assignmentSubmissionsQueryKey(cid!, an!, true) });
            await queryClient.invalidateQueries({ queryKey: assignmentSubmissionsQueryKey(cid!, an!, false) });

            await queryClient.invalidateQueries({ queryKey: assignmentQuestionsQueryKey(cid!, an!, false) });
            await queryClient.invalidateQueries({ queryKey: assignmentQuestionsQueryKey(cid!, an!, true) });
            
            // should probably invalidate all groups related to assignment
            await queryClient.invalidateQueries({ queryKey: groupsQueryKey(cid!, an!, false) });
            await queryClient.invalidateQueries({ queryKey: groupsQueryKey(cid!, an!, true) });
        },
    });
}

export function useUpdateAssignmentMutation(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
): UseMutationReturnType<AssignmentResponse, Error, Partial<AssignmentDTO>, unknown> {
    const queryClient = useQueryClient();
    const { cid, an } = toValues(classid, assignmentNumber, 1, true);

    return useMutation({
        mutationFn: async (data) => new AssignmentController(cid!).updateAssignment(an!, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: groupsQueryKey(cid!, an!, true) });
            await queryClient.invalidateQueries({ queryKey: groupsQueryKey(cid!, an!, false) });

            await queryClient.invalidateQueries({ queryKey: assignmentsQueryKey(cid!, true) });
            await queryClient.invalidateQueries({ queryKey: assignmentsQueryKey(cid!, false) });
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
        queryFn: async () => new AssignmentController(cid!).getSubmissions(gn!, f),
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