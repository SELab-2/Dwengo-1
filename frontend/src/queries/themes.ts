import { useQuery } from "@tanstack/vue-query";
import { type MaybeRefOrGetter, toValue } from "vue";
import {ThemeController} from "@/controllers/themes.ts";

const themeController = new ThemeController();

export const useThemeQuery = (language: MaybeRefOrGetter<string>) =>
    useQuery({
        queryKey: ["themes", language],
        queryFn: () => {
            const lang = toValue(language);
            return themeController.getAll(lang);
        },
        enabled: () => Boolean(toValue(language)),
    });

export const useThemeHruidsQuery = (themeKey: string | null) =>
    useQuery({
        queryKey: ["theme-hruids", themeKey],
        queryFn: () => themeController.getHruidsByKey(themeKey!),
        enabled: Boolean(themeKey),
    });
