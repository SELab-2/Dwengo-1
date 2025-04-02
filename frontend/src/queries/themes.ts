import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import { getThemeController } from "@/controllers/controllers";
import { type MaybeRefOrGetter, toValue } from "vue";
import type { Theme } from "@/data-objects/theme.ts";

const themeController = getThemeController();

export function useThemeQuery(language: MaybeRefOrGetter<string>): UseQueryReturnType<Theme[], Error> {
    return useQuery({
        queryKey: ["themes", language],
        queryFn: async () => {
            const lang = toValue(language);
            return themeController.getAll(lang);
        },
        enabled: () => Boolean(toValue(language)),
    });
}

export function useThemeHruidsQuery(themeKey: string | null): UseQueryReturnType<unknown, Error> {
    return useQuery({
        queryKey: ["theme-hruids", themeKey],
        queryFn: async () => themeController.getHruidsByKey(themeKey!),
        enabled: Boolean(themeKey),
    });
}
