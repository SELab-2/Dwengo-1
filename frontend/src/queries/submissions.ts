import { SubmissionController, type SubmissionResponse, type SubmissionsResponse } from "@/controllers/submissions";
import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

function submissionsQueryKey(classid: string, assignmentNumber: number, full: boolean) {
    return [ "submissions", classid, assignmentNumber, full ];
}
function submissionQueryKey(classid: string, assignmentNumber: number, groupNumber: number) {
    return [ "submission", classid, assignmentNumber, groupNumber ];
}

function checkEnabled(
    classid: string | undefined, 
    assignmentNumber: number | undefined, 
    groupNumber: number | undefined,
    submissionNumber: number | undefined
): boolean {
    return  Boolean(classid) 
        && !isNaN(Number(groupNumber)) 
        && !isNaN(Number(assignmentNumber))
        && !isNaN(Number(submissionNumber));
}
function toValues(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
    submissionNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean>,
) {
    return { 
        cid: toValue(classid), 
        an: toValue(assignmentNumber), 
        gn: toValue(groupNumber), 
        sn: toValue(submissionNumber), 
        f: toValue(full) 
    };
}

export function useSubmissionsQuery(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
    groupNumber: MaybeRefOrGetter<number | undefined>, 
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<SubmissionsResponse, Error> {
    const { cid, an, gn, sn, f } = toValues(classid, assignmentNumber, groupNumber, 1, full);

    return useQuery({
        queryKey: computed(() => (submissionsQueryKey(cid!, an!, f))),
        queryFn: async () => new SubmissionController(cid!, an!, gn!).getAll(f),
        enabled: () => checkEnabled(cid, an, gn, sn),
    });
}

export function useSubmissionQuery(
    classid: MaybeRefOrGetter<string | undefined>, 
    assignmentNumber: MaybeRefOrGetter<number | undefined>, 
    groupNumber: MaybeRefOrGetter<number | undefined>,
): UseQueryReturnType<SubmissionResponse, Error> {
    const { cid, an, gn, sn, f } = toValues(classid, assignmentNumber, groupNumber, 1, true);

    return useQuery({
        queryKey: computed(() => submissionQueryKey(cid!, an!, gn!)),
        queryFn: async () => new SubmissionController(cid!, an!, gn!).getByNumber(sn!),
        enabled: () => checkEnabled(cid, an, gn, sn),
    });
}