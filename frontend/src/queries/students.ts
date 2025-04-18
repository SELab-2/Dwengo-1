import {computed, type Ref, toValue} from "vue";
import type { MaybeRefOrGetter } from "vue";
import {
    type QueryObserverResult,
    useMutation,
    type UseMutationReturnType, useQueries,
    useQuery,
    useQueryClient,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import {
    type JoinRequestResponse,
    type JoinRequestsResponse,
    StudentController,
    type StudentResponse,
    type StudentsResponse,
} from "@/controllers/students.ts";
import type { ClassesResponse } from "@/controllers/classes.ts";
import type { AssignmentsResponse } from "@/controllers/assignments.ts";
import type { GroupsResponse } from "@/controllers/groups.ts";
import type { SubmissionsResponse } from "@/controllers/submissions.ts";
import type { QuestionsResponse } from "@/controllers/questions.ts";
import type { StudentDTO } from "@dwengo-1/common/interfaces/student";

const studentController = new StudentController();

/** 🔑 Query keys */
function studentsQueryKey(full: boolean): [string, boolean] {
    return ["students", full];
}
function studentQueryKey(username: string): [string, string] {
    return ["student", username];
}
function studentClassesQueryKey(username: string, full: boolean): [string, string, boolean] {
    return ["student-classes", username, full];
}
function studentAssignmentsQueryKey(username: string, full: boolean): [string, string, boolean] {
    return ["student-assignments", username, full];
}
function studentGroupsQueryKeys(username: string, full: boolean): [string, string, boolean] {
    return ["student-groups", username, full];
}
function studentSubmissionsQueryKey(username: string): [string, string] {
    return ["student-submissions", username];
}
function studentQuestionsQueryKey(username: string, full: boolean): [string, string, boolean] {
    return ["student-questions", username, full];
}
export function studentJoinRequestsQueryKey(username: string): [string, string] {
    return ["student-join-requests", username];
}
export function studentJoinRequestQueryKey(username: string, classId: string): [string, string, string] {
    return ["student-join-request", username, classId];
}

export function useStudentsQuery(full: MaybeRefOrGetter<boolean> = true): UseQueryReturnType<StudentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => studentsQueryKey(toValue(full))),
        queryFn: async () => studentController.getAll(toValue(full)),
    });
}

export function useStudentQuery(
    username: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<StudentResponse, Error> {
    return useQuery({
        queryKey: computed(() => studentQueryKey(toValue(username)!)),
        queryFn: async () => studentController.getByUsername(toValue(username)!),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useStudentsByUsernamesQuery(
    usernames: MaybeRefOrGetter<string[] | undefined>
): Ref<QueryObserverResult<StudentResponse>[]> {
    const resolvedUsernames = toValue(usernames) ?? [];

    return useQueries({
        queries: resolvedUsernames?.map((username) => ({
            queryKey: computed(() => studentQueryKey(toValue(username))),
            queryFn: async () => studentController.getByUsername(toValue(username)),
            enabled: Boolean(toValue(username)),
        })),
    });
}

export function useStudentClassesQuery(
    username: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<ClassesResponse, Error> {
    return useQuery({
        queryKey: computed(() => studentClassesQueryKey(toValue(username)!, toValue(full))),
        queryFn: async () => studentController.getClasses(toValue(username)!, toValue(full)),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useStudentAssignmentsQuery(
    username: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<AssignmentsResponse, Error> {
    return useQuery({
        queryKey: computed(() => studentAssignmentsQueryKey(toValue(username)!, toValue(full))),
        queryFn: async () => studentController.getAssignments(toValue(username)!, toValue(full)),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useStudentGroupsQuery(
    username: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<GroupsResponse, Error> {
    return useQuery({
        queryKey: computed(() => studentGroupsQueryKeys(toValue(username)!, toValue(full))),
        queryFn: async () => studentController.getGroups(toValue(username)!, toValue(full)),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useStudentSubmissionsQuery(
    username: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<SubmissionsResponse, Error> {
    return useQuery({
        queryKey: computed(() => studentSubmissionsQueryKey(toValue(username)!)),
        queryFn: async () => studentController.getSubmissions(toValue(username)!),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useStudentQuestionsQuery(
    username: MaybeRefOrGetter<string | undefined>,
    full: MaybeRefOrGetter<boolean> = true,
): UseQueryReturnType<QuestionsResponse, Error> {
    return useQuery({
        queryKey: computed(() => studentQuestionsQueryKey(toValue(username)!, toValue(full))),
        queryFn: async () => studentController.getQuestions(toValue(username)!, toValue(full)),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useStudentJoinRequestsQuery(
    username: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<JoinRequestsResponse, Error> {
    return useQuery({
        queryKey: computed(() => studentJoinRequestsQueryKey(toValue(username)!)),
        queryFn: async () => studentController.getJoinRequests(toValue(username)!),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useStudentJoinRequestQuery(
    username: MaybeRefOrGetter<string | undefined>,
    classId: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<JoinRequestResponse, Error> {
    return useQuery({
        queryKey: computed(() => studentJoinRequestQueryKey(toValue(username)!, toValue(classId)!)),
        queryFn: async () => studentController.getJoinRequest(toValue(username)!, toValue(classId)!),
        enabled: () => Boolean(toValue(username)) && Boolean(toValue(classId)),
    });
}

export function useCreateStudentMutation(): UseMutationReturnType<StudentResponse, Error, StudentDTO, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => studentController.createStudent(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["students"] });
        },
    });
}

export function useDeleteStudentMutation(): UseMutationReturnType<StudentResponse, Error, string, unknown> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (username) => studentController.deleteStudent(username),
        onSuccess: async (deletedUser) => {
            await queryClient.invalidateQueries({ queryKey: ["students"] });
            await queryClient.invalidateQueries({ queryKey: studentQueryKey(deletedUser.student.username) });
        },
    });
}

export function useCreateJoinRequestMutation(): UseMutationReturnType<
    JoinRequestResponse,
    Error,
    { username: string; classId: string },
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ username, classId }) => studentController.createJoinRequest(username, classId),
        onSuccess: async (newJoinRequest) => {
            await queryClient.invalidateQueries({
                queryKey: studentJoinRequestsQueryKey(newJoinRequest.request.requester.username),
            });
        },
    });
}

export function useDeleteJoinRequestMutation(): UseMutationReturnType<
    JoinRequestResponse,
    Error,
    { username: string; classId: string },
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ username, classId }) => studentController.deleteJoinRequest(username, classId),
        onSuccess: async (deletedJoinRequest) => {
            const username = deletedJoinRequest.request.requester.username;
            const classId = deletedJoinRequest.request.class;
            await queryClient.invalidateQueries({ queryKey: studentJoinRequestsQueryKey(username) });
            await queryClient.invalidateQueries({ queryKey: studentJoinRequestQueryKey(username, classId) });
        },
    });
}
