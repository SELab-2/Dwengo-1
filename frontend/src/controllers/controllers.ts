import { ThemeController } from "@/controllers/themes.ts";

export function controllerGetter<T>(factory: new () => T): () => T {
    let instance: T | undefined;

    return (): T => {
        if (!instance) {
            instance = new factory();
        }
        return instance;
    };
}

export const getThemeController = controllerGetter(ThemeController);
