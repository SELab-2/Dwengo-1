import type { ClassesResponse } from "@/controllers/classes";
import { GroupController, type GroupResponse, type GroupsResponse } from "@/controllers/groups";
import type { QuestionsResponse } from "@/controllers/questions";
import type { SubmissionsResponse } from "@/controllers/submissions";
import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

const groupController = new GroupController();

function groupsQueryKey(classid: string, assignmentNumber: number) {
    return [ "groups", classid, assignmentNumber ];
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
) {
    return { cid: toValue(classid), an: toValue(assignmentNumber), gn: toValue(groupNumber) };
}

export function useGroupsQuery(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
): UseQueryReturnType<GroupsResponse, Error> {
    const { cid, an, gn } = toValues(classid, assignmentNumber, 1);

    return useQuery({
        queryKey: computed(() => (groupsQueryKey(cid!, an!))),
        queryFn: async () => groupController.getAll(cid!, an!),
        enabled: () => checkEnabled(cid, an, 1),
    });
}

export function useGroupQuery(
    classid: string, 
    assignmentNumber: number, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
): UseQueryReturnType<GroupResponse, Error> {
    const { cid, an, gn } = toValues(classid, assignmentNumber, groupNumber);

    return useQuery({
        queryKey: computed(() => groupQueryKey(cid!, an!, gn!)),
        queryFn: async () => groupController.getByNumber(cid!, an!, gn!),
        enabled: () => checkEnabled(cid, an, gn),
    });
}

export function useGroupSubmissionsQuery(
    classid: string, 
    assignmentNumber: number, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<SubmissionsResponse, Error> {
    const { cid, an, gn } = toValues(classid, assignmentNumber, groupNumber);

    return useQuery({
        queryKey: computed(() => groupSubmissionsQueryKey(cid!, an!, gn!, toValue(full))),
        queryFn: async () => groupController.getSubmissions(cid!, an!, gn!, toValue(full)),
        enabled: () => checkEnabled(cid, an, gn),
    });
}

export function useGroupQuestionsQuery(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<QuestionsResponse, Error> {
    const { cid, an, gn } = toValues(classid, assignmentNumber, groupNumber);

    return useQuery({
        queryKey: computed(() => groupQuestionsQueryKey(cid!, an!, gn!, toValue(full))),
        queryFn: async () => groupController.getSubmissions(cid!, an!, gn!, toValue(full)),
        enabled: () => checkEnabled(cid, an, gn),
    });
}
