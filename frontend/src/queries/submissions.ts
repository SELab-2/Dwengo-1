import { SubmissionController, type SubmissionResponse, type SubmissionsResponse } from '@/controllers/submissions';
import type { SubmissionDTO } from '@dwengo-1/common/interfaces/submission';
import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationReturnType,
    type UseQueryReturnType,
} from '@tanstack/vue-query';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';

type SubmissionsQueryKey = ['submissions', string, number, number, boolean];

function submissionsQueryKey(classid: string, assignmentNumber: number, groupNumber: number, full: boolean): SubmissionsQueryKey {
    return ['submissions', classid, assignmentNumber, groupNumber, full];
}

type SubmissionQueryKey = ['submission', string, number, number, number];

function submissionQueryKey(classid: string, assignmentNumber: number, groupNumber: number, submissionNumber: number): SubmissionQueryKey {
    return ['submission', classid, assignmentNumber, groupNumber, submissionNumber];
}

export async function invalidateAllSubmissionKeys(
    queryClient: QueryClient,
    classid?: string,
    assignmentNumber?: number,
    groupNumber?: number,
    submissionNumber?: number,
): Promise<void> {
    const keys = ['submission'];

    await Promise.all(
        keys.map(async (key) => {
            const queryKey = [key, classid, assignmentNumber, groupNumber, submissionNumber].filter(
                (arg) => arg !== undefined,
            );
            return queryClient.invalidateQueries({ queryKey: queryKey });
        })
    );

    await queryClient.invalidateQueries({
        queryKey: ['submissions', classid, assignmentNumber, groupNumber].filter((arg) => arg !== undefined),
    });
    await queryClient.invalidateQueries({
        queryKey: ['group-submissions', classid, assignmentNumber, groupNumber].filter((arg) => arg !== undefined),
    });
    await queryClient.invalidateQueries({
        queryKey: ['assignment-submissions', classid, assignmentNumber].filter((arg) => arg !== undefined),
    });
}

function checkEnabled(
    classid: string | undefined,
    assignmentNumber: number | undefined,
    groupNumber: number | undefined,
    submissionNumber: number | undefined,
): boolean {
    return (
        Boolean(classid) &&
        !isNaN(Number(groupNumber)) &&
        !isNaN(Number(assignmentNumber)) &&
        !isNaN(Number(submissionNumber))
    );
}

interface Values {
    cid: string | undefined;
    an: number | undefined;
    gn: number | undefined;
    sn: number | undefined;
    f: boolean;
}

function toValues(
    classid: MaybeRefOrGetter<string | undefined>,
    assignmentNumber: MaybeRefOrGetter<number | undefined>,
    groupNumber: MaybeRefOrGetter<number | undefined>,
    submissionNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean>,
): Values {
    return {
        cid: toValue(classid),
        an: toValue(assignmentNumber),
        gn: toValue(groupNumber),
        sn: toValue(submissionNumber),
        f: toValue(full),
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
        queryKey: computed(() => submissionsQueryKey(cid!, an!, gn!, f)),
        queryFn: async () => new SubmissionController(cid!, an!, gn!).getAll(f),
        enabled: () => checkEnabled(cid, an, gn, sn),
    });
}

export function useSubmissionQuery(
    classid: MaybeRefOrGetter<string | undefined>,
    assignmentNumber: MaybeRefOrGetter<number | undefined>,
    groupNumber: MaybeRefOrGetter<number | undefined>,
): UseQueryReturnType<SubmissionResponse, Error> {
    const { cid, an, gn, sn } = toValues(classid, assignmentNumber, groupNumber, 1, true);

    return useQuery({
        queryKey: computed(() => submissionQueryKey(cid!, an!, gn!, sn!)),
        queryFn: async () => new SubmissionController(cid!, an!, gn!).getByNumber(sn!),
        enabled: () => checkEnabled(cid, an, gn, sn),
    });
}

export function useCreateSubmissionMutation(): UseMutationReturnType<
    SubmissionResponse,
    Error,
    { cid: string; an: number; gn: number; data: SubmissionDTO },
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cid, an, gn, data }) => new SubmissionController(cid, an, gn).createSubmission(data),
        onSuccess: async (response) => {
            if (!response.submission.group) {
                await invalidateAllSubmissionKeys(queryClient);
            } else {
                const cls = response.submission.group.class;
                const assignment = response.submission.group.assignment;

                const cid = typeof cls === 'string' ? cls : cls.id;
                const an = typeof assignment === 'number' ? assignment : assignment.id;
                const gn = response.submission.group.groupNumber;

                await invalidateAllSubmissionKeys(queryClient, cid, an, gn);
            }
        },
    });
}

export function useDeleteSubmissionMutation(): UseMutationReturnType<
    SubmissionResponse,
    Error,
    { cid: string; an: number; gn: number; sn: number },
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cid, an, gn, sn }) => new SubmissionController(cid, an, gn).deleteSubmission(sn),
        onSuccess: async (response) => {
            if (!response.submission.group) {
                await invalidateAllSubmissionKeys(queryClient);
            } else {
                const cls = response.submission.group.class;
                const assignment = response.submission.group.assignment;

                const cid = typeof cls === 'string' ? cls : cls.id;
                const an = typeof assignment === 'number' ? assignment : assignment.id;
                const gn = response.submission.group.groupNumber;

                await invalidateAllSubmissionKeys(queryClient, cid, an, gn);
            }
        },
    });
}
