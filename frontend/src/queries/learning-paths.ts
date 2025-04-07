import {type MaybeRefOrGetter, toValue} from "vue";
import type {Language} from "@/data-objects/language.ts";
import {useQuery, type UseQueryReturnType} from "@tanstack/vue-query";
import {getLearningPathController} from "@/controllers/controllers";
import type {LearningPath} from "@/data-objects/learning-paths/learning-path.ts";

const LEARNING_PATH_KEY = "learningPath";
const learningPathController = getLearningPathController();

export function useGetLearningPathQuery(
    hruid: MaybeRefOrGetter<string>,
    language: MaybeRefOrGetter<Language>,
    options?: MaybeRefOrGetter<{ forGroup?: string; forStudent?: string }>,
): UseQueryReturnType<LearningPath, Error> {
    return useQuery({
        queryKey: [LEARNING_PATH_KEY, "get", hruid, language, options],
        queryFn: async () => {
            const [hruidVal, languageVal, optionsVal] = [toValue(hruid), toValue(language), toValue(options)];
            return learningPathController.getBy(hruidVal, languageVal, optionsVal);
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
): UseQueryReturnType<LearningPath[], Error> {
    return useQuery({
        queryKey: [LEARNING_PATH_KEY, "search", query],
        queryFn: async () => {
            const queryVal = toValue(query)!;
            return learningPathController.search(queryVal);
        },
        enabled: () => Boolean(toValue(query)),
    });
}

export function useGetAllLearningPaths(language: MaybeRefOrGetter<string | undefined>
): UseQueryReturnType<LearningPath[], Error> {
    return useQuery({
        queryKey: [LEARNING_PATH_KEY, "getAllLearningPaths", language],
        queryFn: async () => {
            const lang = toValue(language);
            return learningPathController.getAllLearningPaths(lang);
        },
        enabled: () => Boolean(toValue(language))
    });
}
