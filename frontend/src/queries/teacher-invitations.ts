import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationReturnType,
    type UseQueryReturnType,
} from "@tanstack/vue-query";
import { toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import {
    TeacherInvitationController,
    type TeacherInvitationResponse,
    type TeacherInvitationsResponse,
} from "@/controllers/teacher-invitations";
import type { TeacherInvitationData } from "@dwengo-1/common/interfaces/teacher-invitation";

const controller = new TeacherInvitationController();

/** 🔑 Query keys */
export function teacherInvitationsSentQueryKey(username: string): [string, string, string] {
    return ["teacher-invitations", "sent", username];
}

export function teacherInvitationsReceivedQueryKey(username: string): [string, string, string] {
    return ["teacher-invitations", "received", username ];
}

export function teacherInvitationQueryKey(data: TeacherInvitationData): [string, string, string, string] {
    return ["teacher-invitation", data.sender, data.receiver, data.class];
}

/**
 * All the invitations the teacher sent
 */
export function useTeacherInvitationsSentQuery(
    username: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<TeacherInvitationsResponse, Error> {
    return useQuery({
        queryKey: teacherInvitationsSentQueryKey(toValue(username)!),
        queryFn: async () => controller.getAll(toValue(username)!, true),
        enabled: () => Boolean(toValue(username)),
    });
}

/**
 * All the pending invitations sent to this teacher
 */
export function useTeacherInvitationsReceivedQuery(
    username: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<TeacherInvitationsResponse, Error> {
    return useQuery({
        queryKey: teacherInvitationsReceivedQueryKey(toValue(username)!),
        queryFn: async () => controller.getAll(toValue(username)!, false),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useTeacherInvitationQuery(
    data: MaybeRefOrGetter<TeacherInvitationData | undefined>,
): UseQueryReturnType<TeacherInvitationResponse, Error> {
    return useQuery({
        queryKey: teacherInvitationQueryKey(toValue(data)!),
        queryFn: async () => controller.getBy(toValue(data)!),
        enabled: () => Boolean(toValue(data)),
    });
}

export function useCreateTeacherInvitationMutation(): UseMutationReturnType<
    TeacherInvitationResponse,
    Error,
    TeacherInvitationData,
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => controller.create(data),
        onSuccess: async (_, data) => {
            await queryClient.invalidateQueries({
                queryKey: teacherInvitationsSentQueryKey(data.sender),
            });
            await queryClient.invalidateQueries({
                queryKey: teacherInvitationsReceivedQueryKey(data.receiver),
            });
        },
    });
}

export function useRespondTeacherInvitationMutation(): UseMutationReturnType<
    TeacherInvitationResponse,
    Error,
    TeacherInvitationData,
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => controller.respond(data),
        onSuccess: async (_, data) => {
            await queryClient.invalidateQueries({
                queryKey: teacherInvitationsSentQueryKey(data.sender),
            });
            await queryClient.invalidateQueries({
                queryKey: teacherInvitationsReceivedQueryKey(data.receiver),
            });
            await queryClient.invalidateQueries({
                queryKey: teacherInvitationQueryKey(data),
            });
        },
    });
}

export function useDeleteTeacherInvitationMutation(): UseMutationReturnType<
    TeacherInvitationResponse,
    Error,
    TeacherInvitationData,
    unknown
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => controller.remove(data),
        onSuccess: async (_, data) => {
            await queryClient.invalidateQueries({
                queryKey: teacherInvitationsSentQueryKey(data.sender),
            });
            await queryClient.invalidateQueries({
                queryKey: teacherInvitationsReceivedQueryKey(data.receiver),
            });
            await queryClient.invalidateQueries({
                queryKey: teacherInvitationQueryKey(data),
            });
        },
    });
}
