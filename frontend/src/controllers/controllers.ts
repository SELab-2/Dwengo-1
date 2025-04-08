import { ThemeController } from "@/controllers/themes.ts";
import { LearningObjectController } from "@/controllers/learning-objects.ts";
import { LearningPathController } from "@/controllers/learning-paths.ts";
import {ClassController} from "@/controllers/classes.ts";

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
export const getLearningObjectController = controllerGetter(LearningObjectController);
export const getLearningPathController = controllerGetter(LearningPathController);
export const getClassController = controllerGetter(ClassController);
