import {useQuery, type UseQueryReturnType} from "@tanstack/vue-query";
import { type MaybeRefOrGetter, toValue } from "vue";
import { ThemeController } from "@/controllers/themes.ts";
import type {Theme} from "dwengo-1-common/src/interfaces/theme";

const themeController = new ThemeController();

export function useThemeQuery(language: MaybeRefOrGetter<string | undefined>): UseQueryReturnType<Theme[], Error> {
    return useQuery({
        queryKey: ["themes", language],
        queryFn: async () => {
            const lang = toValue(language);
            return themeController.getAll(lang);
        },
        enabled: () => Boolean(toValue(language)),
    });
}

export function useThemeHruidsQuery(themeKey: MaybeRefOrGetter<string | undefined>): UseQueryReturnType<string[], Error> {
    return useQuery({
        queryKey: ["theme-hruids", themeKey],
        queryFn: async () => themeController.getHruidsByKey(toValue(themeKey)!),
        enabled: Boolean(themeKey),
    });
}
