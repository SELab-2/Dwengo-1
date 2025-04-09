import type { ClassesResponse } from "@/controllers/classes";
import { GroupController, type GroupResponse, type GroupsResponse } from "@/controllers/groups";
import type { QuestionsResponse } from "@/controllers/questions";
import type { SubmissionsResponse } from "@/controllers/submissions";
import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

const groupController = new GroupController('', 0);

function groupsQueryKey(classid: string, assignmentNumber: number) {
    return [ "groups", classid, assignmentNumber ];
}
function groupQueryKey(classid: string, assignmentNumber: number, groupNumber: number) {
    return [ "group", classid, assignmentNumber, groupNumber ];
}
function groupSubmissionsQueryKey(classid: string, assignmentNumber: number, groupNumber: number) {
    return [ "group-submissions", classid, assignmentNumber, groupNumber ];
}
function groupQuestionsQueryKey(classid: string, assignmentNumber: number, groupNumber: number) {
    return [ "group-questions", classid, assignmentNumber, groupNumber ];
}

export function useGroupsQuery(
    classid: string, 
    assignmentNumber: number, 
): UseQueryReturnType<GroupsResponse, Error> {
    groupController.update(classid, assignmentNumber);

    return useQuery({
        queryKey: computed(() => (groupsQueryKey(classid, assignmentNumber))),
        queryFn: async () => groupController.getAll(),
    });
}

export function useGroupQuery(
    classid: string, 
    assignmentNumber: number, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
): UseQueryReturnType<GroupResponse, Error> {
    groupController.update(classid, assignmentNumber);

    return useQuery({
        queryKey: computed(() => groupQueryKey(classid, assignmentNumber, toValue(groupNumber)!)),
        queryFn: async () => groupController.getByNumber(toValue(groupNumber)!),
        enabled: () => !isNaN(Number(toValue(groupNumber))),
    });
}

export function useGroupSubmissionsQuery(
    classid: string, 
    assignmentNumber: number, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<SubmissionsResponse, Error> {
    groupController.update(classid, assignmentNumber);

    return useQuery({
        queryKey: computed(() => groupSubmissionsQueryKey(classid, assignmentNumber, toValue(groupNumber)!)),
        queryFn: async () => groupController.getSubmissions(toValue(groupNumber)!, toValue(full)!),
        enabled: () => !isNaN(Number(toValue(groupNumber))),
    });
}

export function useGroupQuestionsQuery(
    classid: string, 
    assignmentNumber: number, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<QuestionsResponse, Error> {
    groupController.update(classid, assignmentNumber);

    return useQuery({
        queryKey: computed(() => groupQuestionsQueryKey(classid, assignmentNumber, toValue(groupNumber)!)),
        queryFn: async () => groupController.getSubmissions(toValue(groupNumber)!, toValue(full)!),
        enabled: () => !isNaN(Number(toValue(groupNumber))),
    });
}
