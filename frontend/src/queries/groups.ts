import type { ClassesResponse } from "@/controllers/classes";
import { GroupController, type GroupResponse, type GroupsResponse } from "@/controllers/groups";
import type { QuestionsResponse } from "@/controllers/questions";
import type { SubmissionsResponse } from "@/controllers/submissions";
import type { GroupDTO } from "@dwengo-1/common/interfaces/group";
import { useMutation, useQuery, useQueryClient, type UseMutationReturnType, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

const groupController = new GroupController();

function groupsQueryKey(classid: string, assignmentNumber: number, full: boolean) {
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
): UseQueryReturnType<GroupsResponse, Error> {
    const { cid, an, f } = toValues(classid, assignmentNumber, 1, true);

    return useQuery({
        queryKey: computed(() => (groupsQueryKey(cid!, an!, f))),
        queryFn: async () => groupController.getAll(cid!, an!),
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
        queryFn: async () => groupController.getByNumber(cid!, an!, gn!),
        enabled: () => checkEnabled(cid, an, gn),
    });
}

// TODO: find way to check if cid and an are not undefined.
// depends on how this function is used.
export function useCreateClassMutation(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
): UseMutationReturnType<GroupResponse, Error, GroupDTO, unknown> {
    const queryClient = useQueryClient();
    const { cid, an } = toValues(classid, assignmentNumber, 1, true);

    return useMutation({
        mutationFn: async (data) => groupController.createGroup(cid!, an!, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: groupsQueryKey(cid!, an!, true) });
            await queryClient.invalidateQueries({ queryKey: groupsQueryKey(cid!, an!, false) });
        },
    });
}

export function useDeleteClassMutation(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
): UseMutationReturnType<GroupResponse, Error, number, unknown> {
    const queryClient = useQueryClient();
    const { cid, an, gn } = toValues(classid, assignmentNumber, 1, true);

    return useMutation({
        mutationFn: async (id) => groupController.deleteGroup(cid!, an!, id),
        onSuccess: async (_) => {
            await queryClient.invalidateQueries({ queryKey: groupQueryKey(cid!, an!, gn!) });

            await queryClient.invalidateQueries({ queryKey: groupsQueryKey(cid!, an!, true) });
            await queryClient.invalidateQueries({ queryKey: groupsQueryKey(cid!, an!, false) });

            await queryClient.invalidateQueries({ queryKey: groupSubmissionsQueryKey(cid!, an!, gn!, true) });
            await queryClient.invalidateQueries({ queryKey: groupSubmissionsQueryKey(cid!, an!, gn!, false) });

            await queryClient.invalidateQueries({ queryKey: groupQuestionsQueryKey(cid!, an!, gn!, true) });
            await queryClient.invalidateQueries({ queryKey: groupQuestionsQueryKey(cid!, an!, gn!, false) });
        },
    });
}

export function useUpdateClassMutation(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
): UseMutationReturnType<GroupResponse, Error, GroupDTO, unknown> {
    const queryClient = useQueryClient();
    const { cid, an, gn } = toValues(classid, assignmentNumber, 1, true);

    return useMutation({
        mutationFn: async (data) => groupController.updateGroup(cid!, an!, gn!, data),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: groupQueryKey(cid!, an!, gn!) });

            await queryClient.invalidateQueries({ queryKey: groupsQueryKey(cid!, an!, true) });
            await queryClient.invalidateQueries({ queryKey: groupsQueryKey(cid!, an!, false) });
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
        queryFn: async () => groupController.getSubmissions(cid!, an!, gn!, f),
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
        queryFn: async () => groupController.getSubmissions(cid!, an!, gn!, f),
        enabled: () => checkEnabled(cid, an, gn),
    });
}
