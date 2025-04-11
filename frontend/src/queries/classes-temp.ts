import {getClassController} from "@/controllers/controllers.ts";
import {computed, type MaybeRefOrGetter, toValue} from "vue";
import {useQuery, type UseQueryReturnType} from "@tanstack/vue-query";
import type {StudentsResponse} from "@/controllers/students.ts";

const classController = getClassController();

function classStudentsQueryKey(classId: string, full: boolean): [string, string, boolean] {
    return ["class-students", classId, full];
}

//TODO: delete and use the one in classes.ts
export function useClassStudentsQuery(
    classId: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<StudentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => classStudentsQueryKey(toValue(classId)!, toValue(full))),
        queryFn: async () => classController.getStudents(toValue(classId)!, toValue(full)),
        enabled: () => Boolean(toValue(classId)),
    });
}
