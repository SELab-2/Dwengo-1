import {StudentController} from "@/controllers/student-controller.ts";
import {TeacherController} from "@/controllers/teacher-controller.ts";

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
