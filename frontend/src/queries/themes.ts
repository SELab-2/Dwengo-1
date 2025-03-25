import { useQuery } from '@tanstack/vue-query';
import { getThemeController } from '@/controllers/controllers';
import {type MaybeRefOrGetter, toValue} from "vue";

const themeController = getThemeController();

export const useThemeQuery = (language: MaybeRefOrGetter<string>) => useQuery({
        queryKey: ['themes', language],
        queryFn: () => {
            const lang = toValue(language);
            return themeController.getAll(lang);
        },
        enabled: () => Boolean(toValue(language)),
    });

export const useThemeHruidsQuery = (themeKey: string | null) => useQuery({
        queryKey: ['theme-hruids', themeKey],
        queryFn: () => themeController.getHruidsByKey(themeKey!),
        enabled: Boolean(themeKey),
    });

