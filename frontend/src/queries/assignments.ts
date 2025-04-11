import {computed, type MaybeRefOrGetter, toValue} from "vue";
import {useQuery, type UseQueryReturnType} from "@tanstack/vue-query";
import {AssignmentController, type AssignmentResponse, type AssignmentsResponse} from "@/controllers/assignments.ts";
import type {SubmissionsResponse} from "@/controllers/submissions.ts";

export function useAssignmentsQuery(classId: MaybeRefOrGetter<string | undefined>, full: MaybeRefOrGetter<boolean> = true): UseQueryReturnType<AssignmentsResponse, Error> {
    const resolvedClassId = toValue(classId) as string;
    const resolvedFull = toValue(full);

    const assignmentController = new AssignmentController(resolvedClassId);
    return useQuery({
        queryKey: computed(() => [
            'assignments',
            resolvedClassId,
            resolvedFull,
        ]),
        queryFn: async () => assignmentController.getAll(resolvedFull),
        enabled: () => Boolean(resolvedClassId)
    })
}


export function useAssignmentQuery(classId: MaybeRefOrGetter<string | undefined>, num: MaybeRefOrGetter<number>): UseQueryReturnType<AssignmentResponse, Error> {
    const resolvedClassId = toValue(classId) as string;
    const resolvedNum = toValue(num);

    const assignmentController = new AssignmentController(resolvedClassId);
    return useQuery({
        queryKey: computed(() => [
            'assignment',
            resolvedClassId,
            resolvedNum,
        ]),
        queryFn: async () => assignmentController.getByNumber(resolvedNum),
        enabled: () => Boolean(resolvedClassId)
    })
}

export function useSubmissionsQuery(classId: MaybeRefOrGetter<string | undefined>, assignmentNum: MaybeRefOrGetter<number>, full: MaybeRefOrGetter<boolean>): UseQueryReturnType<SubmissionsResponse, Error> {
    const resolvedClassId = toValue(classId) as string;
    const resolvedNum = toValue(assignmentNum);
    const resolvedFull = toValue(full);

    const assignmentController = new AssignmentController(resolvedClassId);
    return useQuery({
        queryKey: computed(() => [
            'submissions',
            resolvedClassId,
            resolvedNum,
            resolvedFull
        ]),
        queryFn: async () => assignmentController.getSubmissions(resolvedNum, resolvedFull),
        enabled: () => Boolean(resolvedClassId)
    })
}
