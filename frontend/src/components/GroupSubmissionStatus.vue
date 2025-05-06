<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { useAssignmentSubmissionsQuery } from "@/queries/assignments.ts";
    import type { SubmissionsResponse } from "@/controllers/submissions.ts";

    const props = defineProps<{
        group: object;
        assignmentId: number;
        classId: string;
        goToGroupSubmissionLink: (groupNo: number) => void;
    }>();

    const { t } = useI18n();
    const submissionsQuery = useAssignmentSubmissionsQuery(
        () => props.classId,
        () => props.assignmentId,
        () => props.group.originalGroupNo,
        () => true,
    );
</script>

<template>
    <using-query-result
        :query-result="submissionsQuery"
        v-slot="{ data }: { data: SubmissionsResponse }"
    >
        <v-btn
            :color="data.submissions.length > 0 ? 'green' : 'red'"
            variant="text"
            :to="data.submissions.length > 0 ? goToGroupSubmissionLink(props.group.groupNo) : undefined"
            :disabled="data.submissions.length === 0"
        >
            {{ data.submissions.length > 0 ? t("submission") : t("noSubmissionsYet") }}
        </v-btn>
    </using-query-result>
</template>
