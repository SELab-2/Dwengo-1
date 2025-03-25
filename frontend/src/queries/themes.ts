import { useQuery } from '@tanstack/vue-query';
import { getThemeController } from '@/controllers/controllers';
import {type MaybeRefOrGetter, toValue} from "vue";

const themeController = getThemeController();

export const useThemeQuery = (language: MaybeRefOrGetter<string>) => {
    return useQuery({
        queryKey: ['themes', language],
        queryFn: () => {
            const lang = toValue(language);
            return themeController.getAll(lang);
        },
        enabled: () => !!toValue(language),
    });
};

export const useThemeHruidsQuery = (themeKey: string | null) => {
    return useQuery({
        queryKey: ['theme-hruids', themeKey],
        queryFn: () => themeController.getHruidsByKey(themeKey!),
        enabled: !!themeKey,
    });
};

