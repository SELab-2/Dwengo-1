import { AssignmentController, type AssignmentsResponse } from "@/controllers/assignments";
import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

function assignmentsQueryKey(classid: string, full: boolean) {
    return [ "assignments", classid, full ];
}
function assignmentQueryKey(classid: string, assignmentNumber: number) {
    return [ "assignment", classid, assignmentNumber ];
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
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<AssignmentsResponse, Error> {
    const { cid, an, f } = toValues(classid, assignmentNumber, 1, full);

    return useQuery({
        queryKey: computed(() => (assignmentsQueryKey(cid!, f))),
        queryFn: async () => new AssignmentController(cid!).getAll(f),
        enabled: () => checkEnabled(cid, an, 1),
    });
}

export function useAssignmentQuery(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
): UseQueryReturnType<AssignmentsResponse, Error> {
    const { cid, an, gn } = toValues(classid, assignmentNumber, groupNumber, true);

    return useQuery({
        queryKey: computed(() => assignmentQueryKey(cid!, an!)),
        queryFn: async () => new AssignmentController(cid!).getByNumber(gn!),
        enabled: () => checkEnabled(cid, an, gn),
    });
}