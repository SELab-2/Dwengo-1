import { SubmissionController, type SubmissionResponse } from "@/controllers/submissions";
import type { SubmissionDTO } from "@dwengo-1/common/interfaces/submission";
import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationReturnType,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import {LEARNING_PATH_KEY} from "@/queries/learning-paths.ts";
import {LEARNING_OBJECT_KEY} from "@/queries/learning-objects.ts";
import type {Language} from "@dwengo-1/common/util/language";

export const SUBMISSION_KEY = "submissions";

function submissionQueryKey(
    hruid: string,
    language: Language,
    version: number,
    classid: string,
    assignmentNumber: number,
    groupNumber: number,
    submissionNumber: number
) {
    return ["submission", hruid, language, version, classid, assignmentNumber, groupNumber, submissionNumber];
}

export async function invalidateAllSubmissionKeys(
    queryClient: QueryClient,
    hruid?: string,
    language?: Language,
    version?: number,
    classid?: string,
    assignmentNumber?: number,
    groupNumber?: number,
    submissionNumber?: number,
): Promise<void> {
    const keys = ["submission"];

    for (const key of keys) {
        const queryKey = [
            key, hruid, language, version, classid, assignmentNumber, groupNumber, submissionNumber
        ].filter(
            (arg) => arg !== undefined,
        );
        await queryClient.invalidateQueries({ queryKey: queryKey });
    }

    await queryClient.invalidateQueries({
        queryKey: ["submissions", hruid, language, version, classid, assignmentNumber, groupNumber]
            .filter((arg) => arg !== undefined),
    });
    await queryClient.invalidateQueries({
        queryKey: ["group-submissions", hruid, language, version, classid, assignmentNumber, groupNumber]
            .filter((arg) => arg !== undefined),
    });
    await queryClient.invalidateQueries({
        queryKey: ["assignment-submissions", hruid, language, version,classid, assignmentNumber]
            .filter((arg) => arg !== undefined),
    });
}

function checkEnabled(properties: MaybeRefOrGetter<unknown>[]): boolean {
    return properties.every(prop => !!toValue(prop));
}

export function useSubmissionsQuery(
    hruid: MaybeRefOrGetter<string | undefined>,
    language: MaybeRefOrGetter<Language | undefined>,
    version: MaybeRefOrGetter<number | undefined>,
    classid: MaybeRefOrGetter<string | undefined>,
    assignmentNumber: MaybeRefOrGetter<number | undefined>,
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<SubmissionDTO[], Error> {
    return useQuery({
        queryKey: ["submissions", hruid, language, version, classid, assignmentNumber, groupNumber, full],
        queryFn: async () => {
            const hruidVal = toValue(hruid);
            const languageVal = toValue(language);
            const versionVal = toValue(version);
            const classIdVal = toValue(classid);
            const assignmentNumberVal = toValue(assignmentNumber);
            const groupNumberVal = toValue(groupNumber);
            const fullVal = toValue(full);

            const response = await new SubmissionController(hruidVal!).getAll(
                languageVal!, versionVal!, classIdVal!, assignmentNumberVal!, groupNumberVal, fullVal
            );
            return response ? response.submissions as SubmissionDTO[] : undefined;
        },
        enabled: () => checkEnabled([hruid, language, version, classid, assignmentNumber]),
    });
}

export function useSubmissionQuery(
    hruid: MaybeRefOrGetter<string | undefined>,
    language: MaybeRefOrGetter<Language | undefined>,
    version: MaybeRefOrGetter<number | undefined>,
    classid: MaybeRefOrGetter<string | undefined>,
    assignmentNumber: MaybeRefOrGetter<number | undefined>,
    groupNumber: MaybeRefOrGetter<number | undefined>,
    submissionNumber: MaybeRefOrGetter<number | undefined>,
): UseQueryReturnType<SubmissionResponse, Error> {
    const hruidVal = toValue(hruid);
    const languageVal = toValue(language);
    const versionVal = toValue(version);
    const classIdVal = toValue(classid);
    const assignmentNumberVal = toValue(assignmentNumber);
    const groupNumberVal = toValue(groupNumber);
    const submissionNumberVal = toValue(submissionNumber);

    return useQuery({
        queryKey: computed(() => submissionQueryKey(
            hruidVal!, languageVal!, versionVal!, classIdVal!, assignmentNumberVal!, groupNumberVal!, submissionNumberVal!
        )),
        queryFn: async () => new SubmissionController(hruidVal!).getByNumber(
            languageVal!, versionVal!, classIdVal!, assignmentNumberVal!, groupNumberVal!, submissionNumberVal!
        ),
        enabled: () => !!hruidVal && !!languageVal && !!versionVal && !!classIdVal && !!assignmentNumberVal && !!submissionNumber,
    });
}

export function useCreateSubmissionMutation(): UseMutationReturnType<
    SubmissionResponse,
    Error,
    { data: SubmissionDTO },
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data }) => new SubmissionController(data.learningObjectIdentifier.hruid).createSubmission(data),
        onSuccess: async (response) => {
            if (!response.submission.group) {
                await invalidateAllSubmissionKeys(queryClient);
            } else {
                const cls = response.submission.group.class;
                const assignment = response.submission.group.assignment;

                const cid = typeof cls === "string" ? cls : cls.id;
                const an = typeof assignment === "number" ? assignment : assignment.id;
                const gn = response.submission.group.groupNumber;

                const {hruid, language, version} = response.submission.learningObjectIdentifier;
                await invalidateAllSubmissionKeys(queryClient, hruid, language, version, cid, an, gn);

                await queryClient.invalidateQueries({queryKey: [LEARNING_PATH_KEY, "get"]});

                await queryClient.invalidateQueries({
                    queryKey: [LEARNING_OBJECT_KEY, "metadata", hruid, language, version]
                });
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
        mutationFn: async ({ cid, sn }) => new SubmissionController(cid).deleteSubmission(sn),
        onSuccess: async (response) => {
            if (!response.submission.group) {
                await invalidateAllSubmissionKeys(queryClient);
            } else {
                const cls = response.submission.group.class;
                const assignment = response.submission.group.assignment;

                const cid = typeof cls === "string" ? cls : cls.id;
                const an = typeof assignment === "number" ? assignment : assignment.id;
                const gn = response.submission.group.groupNumber;

                const {hruid, language, version} = response.submission.learningObjectIdentifier;

                await invalidateAllSubmissionKeys(
                    queryClient,
                    hruid,
                    language,
                    version,
                    cid, an, gn
                );
            }
        },
    });
}
