import { type MaybeRefOrGetter, toValue } from "vue";
import type { Language } from "@/data-objects/language.ts";
import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import { getLearningPathController } from "@/controllers/controllers";
import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";

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
