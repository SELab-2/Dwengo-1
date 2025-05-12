import { type MaybeRefOrGetter, toValue } from "vue";
import type { Language } from "@/data-objects/language.ts";
import { useMutation, useQuery, useQueryClient, type UseMutationReturnType, type UseQueryReturnType } from "@tanstack/vue-query";
import { getLearningObjectController } from "@/controllers/controllers.ts";
import type { LearningObject } from "@/data-objects/learning-objects/learning-object.ts";
import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
import type { AxiosError } from "axios";
import type { LearningObjectIdentifierDTO } from "@dwengo-1/common/interfaces/learning-content";

export const LEARNING_OBJECT_KEY = "learningObject";
const learningObjectController = getLearningObjectController();

export function useLearningObjectMetadataQuery(
    hruid: MaybeRefOrGetter<string>,
    language: MaybeRefOrGetter<Language>,
    version: MaybeRefOrGetter<number>,
): UseQueryReturnType<LearningObject, Error> {
    return useQuery({
        queryKey: [LEARNING_OBJECT_KEY, "metadata", hruid, language, version],
        queryFn: async () => {
            const [hruidVal, languageVal, versionVal] = [toValue(hruid), toValue(language), toValue(version)];
            return learningObjectController.getMetadata(hruidVal, languageVal, versionVal);
        },
        enabled: () => Boolean(toValue(hruid)) && Boolean(toValue(language)) && Boolean(toValue(version)),
    });
}

export function useLearningObjectHTMLQuery(
    hruid: MaybeRefOrGetter<string | undefined>,
    language: MaybeRefOrGetter<Language | undefined>,
    version: MaybeRefOrGetter<number | undefined>,
): UseQueryReturnType<Document, Error> {
    return useQuery({
        queryKey: [LEARNING_OBJECT_KEY, "html", hruid, language, version],
        queryFn: async () => {
            const [hruidVal, languageVal, versionVal] = [toValue(hruid), toValue(language), toValue(version)];
            return learningObjectController.getHTML(hruidVal!, languageVal!, versionVal!);
        },
        enabled: () => Boolean(toValue(hruid)) && Boolean(toValue(language)) && Boolean(toValue(version)),
    });
}

export function useLearningObjectListForPathQuery(
    learningPath: MaybeRefOrGetter<LearningPath | undefined>,
): UseQueryReturnType<LearningObject[], Error> {
    return useQuery({
        queryKey: [LEARNING_OBJECT_KEY, "onPath", learningPath],
        queryFn: async () => {
            const learningObjects: Promise<LearningObject>[] = [];
            for (const node of toValue(learningPath)!.nodesAsList) {
                learningObjects.push(
                    learningObjectController.getMetadata(node.learningobjectHruid, node.language, node.version),
                );
            }
            return Promise.all(learningObjects);
        },
        enabled: () => Boolean(toValue(learningPath)),
    });
}

export function useLearningObjectListForAdminQuery(
    admin: MaybeRefOrGetter<string | undefined>
): UseQueryReturnType<LearningObject[], Error> {
    return useQuery({
        queryKey: [LEARNING_OBJECT_KEY, "forAdmin", admin],
        queryFn: async () => {
            const adminVal = toValue(admin);
            return await learningObjectController.getAllAdministratedBy(adminVal!);
        },
        enabled: () => toValue(admin) !== undefined
    });
}

export function useUploadLearningObjectMutation(): UseMutationReturnType<LearningObject, AxiosError, {learningObjectZip: File}, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ learningObjectZip }) => await learningObjectController.upload(learningObjectZip),
        onSuccess: async () => { await queryClient.invalidateQueries({queryKey: [LEARNING_OBJECT_KEY, "forAdmin"]}); }
    });
}

export function useDeleteLearningObjectMutation(): UseMutationReturnType<LearningObject, AxiosError, {hruid: string, language: Language, version: number}, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ hruid, language, version }) => await learningObjectController.deleteLearningObject(hruid, language, version),
        onSuccess: async () => { await queryClient.invalidateQueries({queryKey: [LEARNING_OBJECT_KEY, "forAdmin"]}); }
    });
}
