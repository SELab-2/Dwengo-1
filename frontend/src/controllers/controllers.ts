import {ThemeController} from "@/controllers/themes.ts";

export function controllerGetter<T>(Factory: new () => T): () => T {
    let instance: T | undefined;

    return (): T => {
        if (!instance) {
            instance = new Factory();
        }
        return instance;
    };
}

export const getThemeController = controllerGetter(ThemeController);
