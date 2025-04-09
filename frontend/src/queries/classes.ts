import { ClassController, type ClassesResponse, type ClassResponse } from "@/controllers/classes";
import type { StudentsResponse } from "@/controllers/students";
import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
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