import { useQuery } from "@tanstack/vue-query";
import { type MaybeRefOrGetter, toValue } from "vue";
import { ThemeController } from "@/controllers/themes.ts";

const themeController = new ThemeController();

export function useThemeQuery(language: MaybeRefOrGetter<string | undefined>) {
    return useQuery({
        queryKey: ["themes", language],
        queryFn: () => {
            const lang = toValue(language);
            return themeController.getAll(lang);
        },
        enabled: () => Boolean(toValue(language)),
    });
}

export function useThemeHruidsQuery(themeKey: MaybeRefOrGetter<string | undefined>) {
    return useQuery({
        queryKey: ["theme-hruids", themeKey],
        queryFn: () => themeController.getHruidsByKey(toValue(themeKey)!),
        enabled: Boolean(themeKey),
    });
}
