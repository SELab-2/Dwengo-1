import { ClassController, type ClassesResponse, type ClassResponse } from "@/controllers/classes";
import type { StudentsResponse } from "@/controllers/students";
import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
import { QueryClient, useMutation, useQuery, useQueryClient, type UseMutationReturnType, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

const classController = new ClassController();

function classesQueryKey() {
    return ["classes"];
}
function classQueryKey(classid: string) {
    return ["class", classid];
}
function classStudentsKey(classid: string) {
    return ["class-students", classid];
}
function classTeachersKey(classid: string) {
    return ["class-teachers", classid];
}
function classTeacherInvitationsKey(classid: string) {
    return ["class-teacher-invitations", classid];
}
function classAssignmentsKey(classid: string) {
    return ["class-assignments", classid];
}

async function invalidateAll(classid: string, queryClient: QueryClient): Promise<void> {
    await queryClient.invalidateQueries({ queryKey: ["classes"] });
    await queryClient.invalidateQueries({ queryKey: classQueryKey(classid) });
    await queryClient.invalidateQueries({ queryKey: classStudentsKey(classid) });
    await queryClient.invalidateQueries({ queryKey: classTeachersKey(classid) });
    await queryClient.invalidateQueries({ queryKey: classAssignmentsKey(classid) });
    await queryClient.invalidateQueries({ queryKey: classTeacherInvitationsKey(classid) });
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

export function useCreateClassMutation(): UseMutationReturnType<ClassResponse, Error, ClassDTO, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => classController.createClass(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["classes"] });
        },
    });
}

export function useDeleteClassMutation(): UseMutationReturnType<ClassResponse, Error, string, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => classController.deleteClass(id),
        onSuccess: async (data) => {
            await invalidateAll(data.class.id, queryClient);
        },
    });
}

export function useUpdateClassMutation(): UseMutationReturnType<ClassResponse, Error, ClassDTO, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => classController.updateClass(data.id, data),
        onSuccess: async (data) => {
            await invalidateAll(data.class.id, queryClient);
        },
    });
}

export function useClassStudentsQuery(
    id: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true
): UseQueryReturnType<StudentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => classStudentsKey(toValue(id)!)),
        queryFn: async () => classController.getStudents(toValue(id)!, toValue(full)!),
        enabled: () => Boolean(toValue(id)),
    })
}

export function useClassTeachersQuery(
    id: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true
): UseQueryReturnType<StudentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => classTeachersKey(toValue(id)!)),
        queryFn: async () => classController.getTeachers(toValue(id)!, toValue(full)!),
        enabled: () => Boolean(toValue(id)),
    });
}

export function useClassTeacherInvitationsQuery(
    id: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true
): UseQueryReturnType<StudentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => classTeacherInvitationsKey(toValue(id)!)),
        queryFn: async () => classController.getTeacherInvitations(toValue(id)!, toValue(full)!),
        enabled: () => Boolean(toValue(id)),
    });
}

export function useClassAssignmentsQuery(
    id: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true
): UseQueryReturnType<StudentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => classAssignmentsKey(toValue(id)!)),
        queryFn: async () => classController.getAssignments(toValue(id)!, toValue(full)!),
        enabled: () => Boolean(toValue(id)),
    });
}