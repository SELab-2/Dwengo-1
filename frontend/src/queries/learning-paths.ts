import { type MaybeRefOrGetter, toValue } from "vue";
import type { Language } from "@/data-objects/language.ts";
import { useMutation, useQuery, useQueryClient, type UseMutationReturnType, type UseQueryReturnType } from "@tanstack/vue-query";
import { getLearningPathController } from "@/controllers/controllers";
import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
import type { AxiosError } from "axios";
import type { LearningPathDTO } from "@/data-objects/learning-paths/learning-path-dto";

export const LEARNING_PATH_KEY = "learningPath";
const learningPathController = getLearningPathController();

export function useGetLearningPathQuery(
    hruid: MaybeRefOrGetter<string>,
    language: MaybeRefOrGetter<Language>,
    forGroup?: MaybeRefOrGetter<{ forGroup: number; assignmentNo: number; classId: string } | undefined>,
): UseQueryReturnType<LearningPath, Error> {
    return useQuery({
        queryKey: [LEARNING_PATH_KEY, "get", hruid, language, forGroup],
        queryFn: async () => {
            const [hruidVal, languageVal, forGroupVal] = [toValue(hruid), toValue(language), toValue(forGroup)];
            return learningPathController.getBy(hruidVal, languageVal, forGroupVal);
        },
        enabled: () => Boolean(toValue(hruid)) && Boolean(toValue(language)),
    });
}

export function useGetAllLearningPathsByThemeQuery(
    theme: MaybeRefOrGetter<string>,
): UseQueryReturnType<LearningPath[], Error> {
    return useQuery({
        queryKey: [LEARNING_PATH_KEY, "getAllByTheme", theme],
        queryFn: async () => learningPathController.getAllByTheme(toValue(theme)),
        enabled: () => Boolean(toValue(theme)),
    });
}

export function useGetAllLearningPathsByAdminQuery(
    admin: MaybeRefOrGetter<string | undefined>
): UseQueryReturnType<LearningPathDTO[], AxiosError> {
    return useQuery({
        queryKey: [LEARNING_PATH_KEY, "getAllByAdmin", admin],
        queryFn: async () => learningPathController.getAllByAdminRaw(toValue(admin)!),
        enabled: () => Boolean(toValue(admin))
    });
}

export function usePostLearningPathMutation():
    UseMutationReturnType<LearningPathDTO, AxiosError, { learningPath: LearningPathDTO }, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ learningPath }) => learningPathController.postLearningPath(learningPath),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: [LEARNING_PATH_KEY] })
    });
}

export function usePutLearningPathMutation():
    UseMutationReturnType<LearningPathDTO, AxiosError, { learningPath: LearningPathDTO }, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ learningPath }) => learningPathController.putLearningPath(learningPath),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: [LEARNING_PATH_KEY] })
    });
}

export function useDeleteLearningPathMutation():
    UseMutationReturnType<LearningPathDTO, AxiosError, { hruid: string, language: Language }, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ hruid, language }) => learningPathController.deleteLearningPath(hruid, language),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: [LEARNING_PATH_KEY] })
    });
}

export function useSearchLearningPathQuery(
    query: MaybeRefOrGetter<string | undefined>,
    language: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<LearningPath[], Error> {
    return useQuery({
        queryKey: [LEARNING_PATH_KEY, "search", query, language],
        queryFn: async () => {
            const queryVal = toValue(query)!;
            const languageVal = toValue(language)!;
            return learningPathController.search(queryVal, languageVal);
        },
        enabled: () => Boolean(toValue(query)),
    });
}

export function useGetAllLearningPaths(
    language: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<LearningPath[], Error> {
    return useQuery({
        queryKey: [LEARNING_PATH_KEY, "getAllLearningPaths", language],
        queryFn: async () => {
            const lang = toValue(language);
            return learningPathController.getAllLearningPaths(lang);
        },
        enabled: () => Boolean(toValue(language)),
    });
}
