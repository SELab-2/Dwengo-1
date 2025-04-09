import { ClassController, type ClassesResponse, type ClassResponse } from "@/controllers/classes";
import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

const classController = new ClassController();

function classesQueryKey() {
    return ["students"];
}
function classQueryKey(classid: string) {
    return ["student", classid];
}


export function useClassesQuery(full: MaybeRefOrGetter<boolean> = true): UseQueryReturnType<ClassesResponse, Error> {
    return useQuery({
        queryKey: computed(() => (classesQueryKey())),
        queryFn: async () => classController.getAll(toValue(full)),
    });
}

export function useClassQuery(
    id: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<ClassResponse, Error> {
    return useQuery({
        queryKey: computed(() => classQueryKey(toValue(id)!)),
        queryFn: async () => classController.getById(toValue(id)!),
        enabled: () => Boolean(toValue(id)),
    });
}