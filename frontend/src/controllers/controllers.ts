import { StudentController } from "@/controllers/students.ts";
import { TeacherController } from "@/controllers/teachers.ts";

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

export const getStudentController = controllerGetter(StudentController);
export const getTeacherController = controllerGetter(TeacherController);
export const getThemeController = controllerGetter(ThemeController);
