import { useMutation, useQuery, type UseMutationReturnType, type UseQueryReturnType } from "@tanstack/vue-query";
import { computed, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import {
    TeacherInvitationController,
    type TeacherInvitationResponse,
    type TeacherInvitationsResponse,
} from "@/controllers/teacher-invitations.ts";
import type { TeacherInvitationData } from "@dwengo-1/common/dist/interfaces/teacher-invitation.ts";
import type { TeacherDTO } from "@dwengo-1/common/dist/interfaces/teacher.ts";

const controller = new TeacherInvitationController();

/**
    All the invitations the teacher send
**/
export function useTeacherInvitationsByQuery(
    username: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<TeacherInvitationsResponse, Error> {
    return useQuery({
        queryFn: computed(async () => controller.getAll(toValue(username), true)),
        enabled: () => Boolean(toValue(username)),
    });
}

/**
    All the pending invitations send to this teacher
 */
export function useTeacherInvitationsForQuery(
    username: MaybeRefOrGetter<string | undefined>,
): UseQueryReturnType<TeacherInvitationsResponse, Error> {
    return useQuery({
        queryFn: computed(async () => controller.getAll(toValue(username), false)),
        enabled: () => Boolean(toValue(username)),
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

export function useAcceptTeacherInvitationMutation(): UseMutationReturnType<
    TeacherInvitationResponse,
    Error,
    TeacherDTO,
    unknown
> {
    return useMutation({
        mutationFn: async (data: TeacherInvitationData) => controller.respond(data, true),
    });
}

export function useDeclineTeacherInvitationMutation(): UseMutationReturnType<
    TeacherInvitationResponse,
    Error,
    TeacherDTO,
    unknown
> {
    return useMutation({
        mutationFn: async (data: TeacherInvitationData) => controller.respond(data, false),
    });
}

export function useDeleteTeacherInvitationMutation(): UseMutationReturnType<
    TeacherInvitationResponse,
    Error,
    TeacherDTO,
    unknown
> {
    return useMutation({
        mutationFn: async (data: TeacherInvitationData) => controller.respond(data, false),
    });
}
