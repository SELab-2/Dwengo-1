import { ClassController, type ClassesResponse, type ClassResponse } from "@/controllers/classes";
import type { StudentsResponse } from "@/controllers/students";
import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
import { QueryClient, useMutation, useQuery, useQueryClient, type UseMutationReturnType, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

const classController = new ClassController();

/* Query cache keys */
function classesQueryKey(full: boolean) {
    return ["classes", full];
}
function classQueryKey(classid: string) {
    return ["class", classid];
}
function classStudentsKey(classid: string, full: boolean) {
    return ["class-students", classid, full];
}
function classTeachersKey(classid: string, full: boolean) {
    return ["class-teachers", classid, full];
}
function classTeacherInvitationsKey(classid: string, full: boolean) {
    return ["class-teacher-invitations", classid, full];
}
function classAssignmentsKey(classid: string, full: boolean) {
    return ["class-assignments", classid];
}

/* Function to invalidate all caches with certain class id */
async function invalidateAll(classid: string, queryClient: QueryClient): Promise<void> {
    await queryClient.invalidateQueries({ queryKey: ["classes"] });
    await queryClient.invalidateQueries({ queryKey: classQueryKey(classid) });
    for (let v of [true, false]) {
        await queryClient.invalidateQueries({ queryKey: classStudentsKey(classid, v) });
        await queryClient.invalidateQueries({ queryKey: classTeachersKey(classid, v) });
        await queryClient.invalidateQueries({ queryKey: classAssignmentsKey(classid, v) });
        await queryClient.invalidateQueries({ queryKey: classTeacherInvitationsKey(classid, v) });
    }
}

/* Queries */
export function useClassesQuery(full: MaybeRefOrGetter<boolean> = true): UseQueryReturnType<ClassesResponse, Error> {
    return useQuery({
        queryKey: computed(() => (classesQueryKey(toValue(full)))),
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
            await queryClient.invalidateQueries({ queryKey: classesQueryKey(true) });
            await queryClient.invalidateQueries({ queryKey: classesQueryKey(false) });
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
        queryKey: computed(() => classStudentsKey(toValue(id)!, toValue(full))),
        queryFn: async () => classController.getStudents(toValue(id)!, toValue(full)!),
        enabled: () => Boolean(toValue(id)),
    })
}

export function useClassAddStudentMutation(): UseMutationReturnType<ClassResponse, Error, {id: string, username: string}, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, username }) => classController.addStudent(id, username),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: classQueryKey(data.class.id) });
            await queryClient.invalidateQueries({ queryKey: classStudentsKey(data.class.id, true) });
            await queryClient.invalidateQueries({ queryKey: classStudentsKey(data.class.id, false) });
        },
    });
}

export function useClassDeleteStudentMutation(): UseMutationReturnType<ClassResponse, Error, {id: string, username: string}, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, username }) => classController.deleteStudent(id, username),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: classQueryKey(data.class.id) });
            await queryClient.invalidateQueries({ queryKey: classStudentsKey(data.class.id, true) });
            await queryClient.invalidateQueries({ queryKey: classStudentsKey(data.class.id, false) });
        },
    });
}

export function useClassTeachersQuery(
    id: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true
): UseQueryReturnType<StudentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => classTeachersKey(toValue(id)!, toValue(full))),
        queryFn: async () => classController.getTeachers(toValue(id)!, toValue(full)!),
        enabled: () => Boolean(toValue(id)),
    });
}

export function useClassAddTeacherMutation(): UseMutationReturnType<ClassResponse, Error, {id: string, username: string}, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, username }) => classController.addTeacher(id, username),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: classQueryKey(data.class.id) });
            await queryClient.invalidateQueries({ queryKey: classTeachersKey(data.class.id, true) });
            await queryClient.invalidateQueries({ queryKey: classTeachersKey(data.class.id, false) });
        },
    });
}

export function useClassDeleteTeacherMutation(): UseMutationReturnType<ClassResponse, Error, {id: string, username: string}, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, username }) => classController.deleteTeacher(id, username),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: classQueryKey(data.class.id) });
            await queryClient.invalidateQueries({ queryKey: classTeachersKey(data.class.id, true) });
            await queryClient.invalidateQueries({ queryKey: classTeachersKey(data.class.id, false) });
        },
    });
}

export function useClassTeacherInvitationsQuery(
    id: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true
): UseQueryReturnType<StudentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => classTeacherInvitationsKey(toValue(id)!, toValue(full))),
        queryFn: async () => classController.getTeacherInvitations(toValue(id)!, toValue(full)!),
        enabled: () => Boolean(toValue(id)),
    });
}

export function useClassAssignmentsQuery(
    id: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true
): UseQueryReturnType<StudentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => classAssignmentsKey(toValue(id)!, toValue(full))),
        queryFn: async () => classController.getAssignments(toValue(id)!, toValue(full)!),
        enabled: () => Boolean(toValue(id)),
    });
}