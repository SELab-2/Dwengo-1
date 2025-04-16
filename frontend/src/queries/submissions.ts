import { SubmissionController, type SubmissionResponse, type SubmissionsResponse } from "@/controllers/submissions";
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

function submissionsQueryKey(
    hruid: string,
    language: Language,
    version: number,
    classid: string,
    assignmentNumber: number,
    groupNumber?: number,
    full?: boolean
) {
    return ["submissions", hruid, language, version, classid, assignmentNumber, groupNumber, full ?? false];
}

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
) {
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

function checkEnabled(
    classid: string | undefined,
    assignmentNumber: number | undefined,
    groupNumber: number | undefined,
    submissionNumber?: number | undefined,
    submissionNumberRequired: boolean = false
): boolean {
    return (
        Boolean(classid) &&
        !isNaN(Number(groupNumber)) &&
        !isNaN(Number(assignmentNumber)) &&
        (!isNaN(Number(submissionNumber)) || !submissionNumberRequired)
    );
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
        f: toValue(full),
    };
}
export function useSubmissionsQuery(
    hruid: MaybeRefOrGetter<string | undefined>,
    language: MaybeRefOrGetter<Language | undefined>,
    version: MaybeRefOrGetter<number | undefined>,
    classid: MaybeRefOrGetter<string | undefined>,
    assignmentNumber: MaybeRefOrGetter<number | undefined>,
    groupNumber: MaybeRefOrGetter<number | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<SubmissionsResponse, Error> {
    const hruidVal = toValue(hruid);
    const languageVal = toValue(language);
    const versionVal = toValue(version);
    const classIdVal = toValue(classid);
    const assignmentNumberVal = toValue(assignmentNumber);
    const groupNumberVal = toValue(groupNumber);
    const fullVal = toValue(full);

    return useQuery({
        queryKey: computed(() =>
            submissionsQueryKey(
                hruidVal!,
                languageVal!,
                versionVal!,
                classIdVal!,
                assignmentNumberVal!,
                groupNumberVal,
                fullVal
            )
        ),
        queryFn: async () => new SubmissionController(hruidVal!).getAll(
            languageVal!, versionVal!, classIdVal!, assignmentNumberVal!, groupNumberVal, fullVal
        ),
        enabled: () => !!hruidVal && !!languageVal && !!versionVal && !!classIdVal && !!assignmentNumberVal,
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
    const { cid, an, gn, sn, f } = toValues(classid, assignmentNumber, groupNumber, submissionNumber, true);

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

                console.log("INVALIDATE");
                console.log([
                    LEARNING_PATH_KEY, "get",
                    response.submission.learningObjectIdentifier.hruid,
                ]);
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
        mutationFn: async ({ cid, an, gn, sn }) => new SubmissionController(cid).deleteSubmission(sn),
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
