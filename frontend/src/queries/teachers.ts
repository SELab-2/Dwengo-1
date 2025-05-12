import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationReturnType,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import { TeacherController, type TeacherResponse, type TeachersResponse } from "@/controllers/teachers.ts";
import type { ClassesResponse } from "@/controllers/classes.ts";
import type { JoinRequestResponse, JoinRequestsResponse, StudentsResponse } from "@/controllers/students.ts";
import type { TeacherDTO } from "@dwengo-1/common/interfaces/teacher";
import { studentJoinRequestQueryKey, studentJoinRequestsQueryKey } from "@/queries/students.ts";

const teacherController = new TeacherController();

/** 🔑 Query keys */
function teachersQueryKey(full: boolean): [string, boolean] {
    return ["teachers", full];
}

function teacherQueryKey(username: string): [string, string] {
    return ["teacher", username];
}

function teacherClassesQueryKey(username: string, full: boolean): [string, string, boolean] {
    return ["teacher-classes", username, full];
}

function teacherStudentsQueryKey(username: string, full: boolean): [string, string, boolean] {
    return ["teacher-students", username, full];
}

function teacherQuestionsQueryKey(username: string, full: boolean): [string, string, boolean] {
    return ["teacher-questions", username, full];
}

export function teacherClassJoinRequests(classId: string): [string, string] {
    return ["teacher-class-join-requests", classId];
}

export function useTeachersQuery(full: MaybeRefOrGetter<boolean> = false): UseQueryReturnType<TeachersResponse, Error> {
    return useQuery({
        queryKey: computed(() => teachersQueryKey(toValue(full))),
        queryFn: async () => teacherController.getAll(toValue(full)),
    });
}

export function useTeacherQuery(
    username: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<TeacherResponse, Error> {
    return useQuery({
        queryKey: computed(() => teacherQueryKey(toValue(username)!)),
        queryFn: async () => teacherController.getByUsername(toValue(username)!),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useTeacherClassesQuery(
    username: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = false,
): UseQueryReturnType<ClassesResponse, Error> {
    return useQuery({
        queryKey: computed(() => teacherClassesQueryKey(toValue(username)!, toValue(full))),
        queryFn: async () => teacherController.getClasses(toValue(username)!, toValue(full)),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useTeacherStudentsQuery(
    username: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = false,
): UseQueryReturnType<StudentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => teacherStudentsQueryKey(toValue(username)!, toValue(full))),
        queryFn: async () => teacherController.getStudents(toValue(username)!, toValue(full)),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useTeacherJoinRequestsQuery(
    username: MaybeRefOrGetter<string | undefined>,
    classId: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<JoinRequestsResponse, Error> {
    return useQuery({
        queryKey: computed(() => teacherClassJoinRequests(toValue(classId)!)),
        queryFn: async () => teacherController.getStudentJoinRequests(toValue(username)!, toValue(classId)!),
        enabled: () => Boolean(toValue(username)) && Boolean(toValue(classId)),
    });
}

export function useCreateTeacherMutation(): UseMutationReturnType<TeacherResponse, Error, TeacherDTO, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TeacherDTO) => teacherController.createTeacher(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
    });
}

export function useDeleteTeacherMutation(): UseMutationReturnType<TeacherResponse, Error, string, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (username: string) => teacherController.deleteTeacher(username),
        onSuccess: async (deletedTeacher) => {
            await queryClient.invalidateQueries({ queryKey: ["teachers"] });
            await queryClient.invalidateQueries({ queryKey: teacherQueryKey(deletedTeacher.teacher.username) });
        },
    });
}

export function useUpdateJoinRequestMutation(): UseMutationReturnType<
    JoinRequestResponse,
    Error,
    { teacherUsername: string; classId: string; studentUsername: string; accepted: boolean },
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ teacherUsername, classId, studentUsername, accepted }) =>
            teacherController.updateStudentJoinRequest(teacherUsername, classId, studentUsername, accepted),
        onSuccess: async (deletedJoinRequest) => {
            const username = deletedJoinRequest.request.requester.username;
            const classId = deletedJoinRequest.request.class;
            await queryClient.invalidateQueries({ queryKey: studentJoinRequestsQueryKey(username) });
            await queryClient.invalidateQueries({ queryKey: studentJoinRequestQueryKey(username, classId) });
            await queryClient.invalidateQueries({ queryKey: teacherClassJoinRequests(classId) });
        },
    });
}
