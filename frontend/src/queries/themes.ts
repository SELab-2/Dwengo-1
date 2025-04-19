import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import { type MaybeRefOrGetter, toValue } from "vue";
import { getThemeController } from "@/controllers/controllers.ts";
import type { Theme } from "@dwengo-1/common/interfaces/theme";

const themeController = getThemeController();

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

export function useThemeHruidsQuery(
    themeKey: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<string[], Error> {
    return useQuery({
        queryKey: ["theme-hruids", themeKey],
        queryFn: async () => themeController.getHruidsByKey(toValue(themeKey)!),
        enabled: Boolean(themeKey),
    });
}
