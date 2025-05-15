<script setup lang="ts">
    import { computed } from "vue";
    import authService from "@/services/auth/auth-service.ts";
    import type { SubmissionData } from "@/views/learning-paths/learning-object/submission-data";
    import { Language } from "@/data-objects/language.ts";
    import type { SubmissionDTO } from "@dwengo-1/common/interfaces/submission";
    import { useCreateSubmissionMutation } from "@/queries/submissions.ts";
    import { deepEquals } from "@/utils/deep-equals.ts";
    import type { UserProfile } from "oidc-client-ts";
    import type { LearningObjectIdentifierDTO } from "@dwengo-1/common/interfaces/learning-content";
    import type { StudentDTO } from "@dwengo-1/common/interfaces/student";
    import type { GroupDTO } from "@dwengo-1/common/interfaces/group";
    import { useI18n } from "vue-i18n";
    import { AccountType } from "@dwengo-1/common/util/account-types";

    const { t } = useI18n();

    const props = defineProps<{
        submissionData?: SubmissionData;
        submissions: SubmissionDTO[];
        hruid: string;
        language: Language;
        version: number;
        group: { forGroup: number; assignmentNo: number; classId: string };
    }>();

    const {
        isPending: submissionIsPending,
        // - isError: submissionFailed,
        // - error: submissionError,
        // - isSuccess: submissionSuccess,
        mutate: submitSolution,
    } = useCreateSubmissionMutation();

    const isStudent = computed(() => authService.authState.activeRole === AccountType.Student);

    const isSubmitDisabled = computed(() => {
        if (!props.submissionData || props.submissions === undefined) {
            return true;
        }
        if (props.submissionData.some((answer) => answer === null)) {
            return false;
        }
        if (props.submissions.length === 0) {
            return false;
        }
        return deepEquals(JSON.parse(props.submissions[props.submissions.length - 1].content), props.submissionData);
    });

    function submitCurrentAnswer(): void {
        const { forGroup, assignmentNo, classId } = props.group;
        const currentUser: UserProfile = authService.authState.user!.profile;
        const learningObjectIdentifier: LearningObjectIdentifierDTO = {
            hruid: props.hruid,
            language: props.language,
            version: props.version,
        };
        const submitter: StudentDTO = {
            id: currentUser.preferred_username!,
            username: currentUser.preferred_username!,
            firstName: currentUser.given_name!,
            lastName: currentUser.family_name!,
        };
        const group: GroupDTO = {
            class: classId,
            assignment: assignmentNo,
            groupNumber: forGroup,
        };
        const submission: SubmissionDTO = {
            learningObjectIdentifier,
            submitter,
            group,
            content: JSON.stringify(props.submissionData),
        };
        submitSolution({ data: submission });
    }

    const buttonText = computed(() => {
        if (props.submissionData && props.submissionData.length === 0) {
            return t("markAsDone");
        }
        return t(props.submissions.length > 0 ? "submitNewSolution" : "submitSolution");
    });
</script>

<template>
    <v-btn
        v-if="isStudent && !isSubmitDisabled"
        prepend-icon="mdi-check"
        variant="elevated"
        :loading="submissionIsPending"
        :disabled="isSubmitDisabled"
        @click="submitCurrentAnswer()"
    >
        {{ buttonText }}
    </v-btn>
</template>

<style scoped></style>
