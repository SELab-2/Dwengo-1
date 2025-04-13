import type { ClassesResponse } from "@/controllers/classes";
import { GroupController, type GroupResponse, type GroupsResponse } from "@/controllers/groups";
import type { QuestionsResponse } from "@/controllers/questions";
import type { SubmissionsResponse } from "@/controllers/submissions";
import type { GroupDTO } from "@dwengo-1/common/interfaces/group";
import { QueryClient, useMutation, useQuery, useQueryClient, type UseMutationReturnType, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { invalidateAllAssignmentKeys } from "./assignments";
import { invalidateAllSubmissionKeys } from "./submissions";

export function groupsQueryKey(classid: string, assignmentNumber: number, full: boolean) {
    return [ "groups", classid, assignmentNumber, full ];
}
function groupQueryKey(classid: string, assignmentNumber: number, groupNumber: number) {
    return [ "group", classid, assignmentNumber, groupNumber ];
}
function groupSubmissionsQueryKey(classid: string, assignmentNumber: number, groupNumber: number, full: boolean) {
    return [ "group-submissions", classid, assignmentNumber, groupNumber, full ];
}
function groupQuestionsQueryKey(classid: string, assignmentNumber: number, groupNumber: number, full: boolean) {
    return [ "group-questions", classid, assignmentNumber, groupNumber, full ];
}

export async function invalidateAllGroupKeys(
    queryClient: QueryClient, 
    classid?: string, 
    assignmentNumber?: number,
    groupNumber?: number,
) {
    const keys = [
        "group",
        "group-submissions",
        "group-questions",
    ];

    for (let key of keys) {
        const queryKey = [key, classid, assignmentNumber, groupNumber].filter(arg => arg !== undefined);
        await queryClient.invalidateQueries({ queryKey: queryKey });
    }

    await queryClient.invalidateQueries({ queryKey: [ "groups", classid, assignmentNumber ].filter(arg => arg !== undefined) });
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

export function useGroupsQuery(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<GroupsResponse, Error> {
    const { cid, an, f } = toValues(classid, assignmentNumber, 1, full);

    return useQuery({
        queryKey: computed(() => (groupsQueryKey(cid!, an!, f))),
        queryFn: async () => new GroupController(cid!, an!).getAll(f),
        enabled: () => checkEnabled(cid, an, 1),
    });
}

export function useGroupQuery(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
): UseQueryReturnType<GroupResponse, Error> {
    const { cid, an, gn } = toValues(classid, assignmentNumber, groupNumber, true);

    return useQuery({
        queryKey: computed(() => groupQueryKey(cid!, an!, gn!)),
        queryFn: async () => new GroupController(cid!, an!).getByNumber(gn!),
        enabled: () => checkEnabled(cid, an, gn),
    });
}

export function useCreateGroupMutation(): UseMutationReturnType<GroupResponse, Error, {cid: string, an: number, data: GroupDTO}, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cid, an, data }) => new GroupController(cid, an).createGroup(data),
        onSuccess: async (response) => {
            const cid = typeof(response.group.class) === 'string' ? response.group.class : response.group.class.id;
            const an = typeof(response.group.assignment) === 'number' ? response.group.assignment : response.group.assignment.id;

            await queryClient.invalidateQueries({ queryKey: groupsQueryKey(cid, an, true) });
            await queryClient.invalidateQueries({ queryKey: groupsQueryKey(cid, an, false) });
        },
    });
}

export function useDeleteGroupMutation(): UseMutationReturnType<GroupResponse, Error, {cid: string, an: number, gn: number}, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({cid, an, gn}) => new GroupController(cid, an).deleteGroup(gn),
        onSuccess: async (response) => {
            const cid = typeof(response.group.class) === 'string' ? response.group.class : response.group.class.id;
            const an = typeof(response.group.assignment) === 'number' ? response.group.assignment : response.group.assignment.id;
            const gn = response.group.groupNumber;

            await invalidateAllGroupKeys(queryClient, cid, an, gn);
            await invalidateAllSubmissionKeys(queryClient, cid, an, gn);
        },
    });
}

export function useUpdateGroupMutation(): UseMutationReturnType<GroupResponse, Error, {cid: string, an: number, gn: number, data: Partial<GroupDTO>}, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({cid, an, gn, data}) => new GroupController(cid, an).updateGroup(gn, data),
        onSuccess: async (response) => {
            const cid = typeof(response.group.class) === 'string' ? response.group.class : response.group.class.id;
            const an = typeof(response.group.assignment) === 'number' ? response.group.assignment : response.group.assignment.id;
            const gn = response.group.groupNumber;

            await invalidateAllGroupKeys(queryClient, cid, an, gn);
        },
    });
}

export function useGroupSubmissionsQuery(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<SubmissionsResponse, Error> {
    const { cid, an, gn, f } = toValues(classid, assignmentNumber, groupNumber, full);

    return useQuery({
        queryKey: computed(() => groupSubmissionsQueryKey(cid!, an!, gn!, f)),
        queryFn: async () => new GroupController(cid!, an!).getSubmissions(gn!, f),
        enabled: () => checkEnabled(cid, an, gn),
    });
}

export function useGroupQuestionsQuery(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<QuestionsResponse, Error> {
    const { cid, an, gn, f } = toValues(classid, assignmentNumber, groupNumber, full);

    return useQuery({
        queryKey: computed(() => groupQuestionsQueryKey(cid!, an!, gn!, f)),
        queryFn: async () => new GroupController(cid!, an!).getSubmissions(gn!, f),
        enabled: () => checkEnabled(cid, an, gn),
    });
}
