import { useMutation, useQuery, type UseMutationReturnType, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import {
    TeacherInvitationController,
    type TeacherInvitationResponse,
    type TeacherInvitationsResponse,
} from "@/controllers/teacher-invitations.ts";
import type { TeacherInvitationData } from "@dwengo-1/common/interfaces/teacher-invitation";
import type { TeacherDTO } from "@dwengo-1/common/interfaces/teacher";

const controller = new TeacherInvitationController();

/**
    All the invitations the teacher sent
**/
export function useTeacherInvitationsSentQuery(
    username: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<TeacherInvitationsResponse, Error> {
    return useQuery({
        queryFn: computed(async () => controller.getAll(toValue(username), true)),
        enabled: () => Boolean(toValue(username)),
    });
}

/**
    All the pending invitations sent to this teacher
 */
export function useTeacherInvitationsReceivedQuery(
    username: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<TeacherInvitationsResponse, Error> {
    return useQuery({
        queryFn: computed(async () => controller.getAll(toValue(username), false)),
        enabled: () => Boolean(toValue(username)),
    });
}

export function useTeacherInvitationQuery(
    data: MaybeRefOrGetter<TeacherInvitationData | undefined>,
): UseQueryReturnType<TeacherInvitationResponse, Error> {
    return useQuery({
        queryFn: computed(async () => controller.getBy(toValue(data))),
        enabled: () => Boolean(toValue(data)),
    });
}

export function useCreateTeacherInvitationMutation(): UseMutationReturnType<
    TeacherInvitationResponse,
    Error,
    TeacherDTO,
    unknown
> {
    return useMutation({
        mutationFn: async (data: TeacherInvitationData) => controller.create(data),
    });
}

export function useRespondTeacherInvitationMutation(): UseMutationReturnType<
    TeacherInvitationResponse,
    Error,
    TeacherDTO,
    unknown
> {
    return useMutation({
        mutationFn: async (data: TeacherInvitationData) => controller.respond(data),
    });
}

export function useDeleteTeacherInvitationMutation(): UseMutationReturnType<
    TeacherInvitationResponse,
    Error,
    TeacherDTO,
    unknown
> {
    return useMutation({
        mutationFn: async (data: TeacherInvitationData) => controller.remove(data),
    });
}
