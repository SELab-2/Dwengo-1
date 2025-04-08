import {useMutation, useQueryClient, type UseMutationReturnType} from "@tanstack/vue-query";
import {AssignmentController, type AssignmentResponse} from "@/controllers/assignments.ts";
import type {AssignmentDTO} from "@dwengo-1/common/interfaces/assignment";
import {toValue} from "vue";

export function useCreateAssignmentMutation(classId: string): UseMutationReturnType<AssignmentResponse, Error, AssignmentDTO, unknown> {
    const queryClient = useQueryClient();

    const assignmentController = new AssignmentController(toValue(classId));

    return useMutation({
        mutationFn: async (data) => assignmentController.createAssignment(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["assignments"]});
        },
    });
}
