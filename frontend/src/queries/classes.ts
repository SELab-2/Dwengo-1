import {useQuery, type UseQueryReturnType} from "@tanstack/vue-query";
import {computed, type MaybeRefOrGetter, toValue} from "vue";
import type {StudentsResponse} from "@/controllers/students.ts";
import {getClassController} from "@/controllers/controllers.ts";

const classController = getClassController();

function classStudentsQueryKey(classId: string, full: boolean): [string, string, boolean] {
    return ["class-students", classId, full];
}


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
