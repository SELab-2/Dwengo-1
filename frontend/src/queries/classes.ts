import { ClassController, type ClassesResponse, type ClassResponse } from "@/controllers/classes";
import type { StudentsResponse } from "@/controllers/students";
import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationReturnType,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { invalidateAllAssignmentKeys } from "./assignments";
import { invalidateAllGroupKeys } from "./groups";
import { invalidateAllSubmissionKeys } from "./submissions";
import type { TeachersResponse } from "@/controllers/teachers";
import type { TeacherInvitationsResponse } from "@/controllers/teacher-invitations";

const classController = new ClassController();

/* Query cache keys */
type ClassesQueryKey = ["classes", boolean];

function classesQueryKey(full: boolean): ClassesQueryKey {
    return ["classes", full];
}

type ClassQueryKey = ["class", string];

function classQueryKey(classid: string): ClassQueryKey {
    return ["class", classid];
}

type ClassStudentsKey = ["class-students", string, boolean];

function classStudentsKey(classid: string, full: boolean): ClassStudentsKey {
    return ["class-students", classid, full];
}

type ClassTeachersKey = ["class-teachers", string, boolean];

function classTeachersKey(classid: string, full: boolean): ClassTeachersKey {
    return ["class-teachers", classid, full];
}

type ClassTeacherInvitationsKey = ["class-teacher-invitations", string, boolean];

function classTeacherInvitationsKey(classid: string, full: boolean): ClassTeacherInvitationsKey {
    return ["class-teacher-invitations", classid, full];
}

type ClassAssignmentsKey = ["class-assignments", string, boolean];

function classAssignmentsKey(classid: string, full: boolean): ClassAssignmentsKey {
    return ["class-assignments", classid, full];
}

export async function invalidateAllClassKeys(queryClient: QueryClient, classid?: string): Promise<void> {
    const keys = ["class", "class-students", "class-teachers", "class-teacher-invitations", "class-assignments"];

    await Promise.all(
        keys.map(async (key) => {
            const queryKey = [key, classid].filter((arg) => arg !== undefined);
            return queryClient.invalidateQueries({ queryKey: queryKey });
        }),
    );

    await queryClient.invalidateQueries({ queryKey: ["classes"] });
}

/* Queries */
export function useClassesQuery(full: MaybeRefOrGetter<boolean> = true): UseQueryReturnType<ClassesResponse, Error> {
    return useQuery({
        queryKey: computed(() => classesQueryKey(toValue(full))),
        queryFn: async () => classController.getAll(toValue(full)),
    });
}

export function useClassQuery(id: MaybeRefOrGetter<string | undefined>): UseQueryReturnType<ClassResponse, Error> {
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
            await invalidateAllClassKeys(queryClient, data.class.id);
            await invalidateAllAssignmentKeys(queryClient, data.class.id);
            await invalidateAllGroupKeys(queryClient, data.class.id);
            await invalidateAllSubmissionKeys(queryClient, data.class.id);
        },
    });
}

export function useUpdateClassMutation(): UseMutationReturnType<
    ClassResponse,
    Error,
    { cid: string; data: Partial<ClassDTO> },
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cid, data }) => classController.updateClass(cid, data),
        onSuccess: async (data) => {
            await invalidateAllClassKeys(queryClient, data.class.id);
            await invalidateAllAssignmentKeys(queryClient, data.class.id);
            await invalidateAllGroupKeys(queryClient, data.class.id);
            await invalidateAllSubmissionKeys(queryClient, data.class.id);
        },
    });
}

export function useClassStudentsQuery(
    id: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<StudentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => classStudentsKey(toValue(id)!, toValue(full))),
        queryFn: async () => classController.getStudents(toValue(id)!, toValue(full)),
        enabled: () => Boolean(toValue(id)),
    });
}

export function useClassAddStudentMutation(): UseMutationReturnType<
    ClassResponse,
    Error,
    { id: string; username: string },
    unknown
> {
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

export function useClassDeleteStudentMutation(): UseMutationReturnType<
    ClassResponse,
    Error,
    { id: string; username: string },
    unknown
> {
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
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<TeachersResponse, Error> {
    return useQuery({
        queryKey: computed(() => classTeachersKey(toValue(id)!, toValue(full))),
        queryFn: async () => classController.getTeachers(toValue(id)!, toValue(full)),
        enabled: () => Boolean(toValue(id)),
    });
}

export function useClassAddTeacherMutation(): UseMutationReturnType<
    ClassResponse,
    Error,
    { id: string; username: string },
    unknown
> {
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

export function useClassDeleteTeacherMutation(): UseMutationReturnType<
    ClassResponse,
    Error,
    { id: string; username: string },
    unknown
> {
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
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<TeacherInvitationsResponse, Error> {
    return useQuery({
        queryKey: computed(() => classTeacherInvitationsKey(toValue(id)!, toValue(full))),
        queryFn: async () => classController.getTeacherInvitations(toValue(id)!, toValue(full)),
        enabled: () => Boolean(toValue(id)),
    });
}

export function useClassAssignmentsQuery(
    id: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<StudentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => classAssignmentsKey(toValue(id)!, toValue(full))),
        queryFn: async () => classController.getAssignments(toValue(id)!, toValue(full)),
        enabled: () => Boolean(toValue(id)),
    });
}
