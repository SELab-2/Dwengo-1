<script setup lang="ts">
import type {Language} from "@/data-objects/language.ts";
import {useI18n} from "vue-i18n";
import UsingQueryResult from "@/components/UsingQueryResult.vue";
import {useAssignmentSubmissionsQuery} from "@/queries/assignments.ts";
import type {SubmissionsResponse} from "@/controllers/submissions.ts";

const props = defineProps<{
    lpHruid: string,
    group: object;
    assignmentId: number;
    classId: string;
    language: Language;
    goToGroupSubmissionLink: (groupNo: number) => void;
}>();

const {t} = useI18n();
// Call the submissions query
const submissionsQuery = useAssignmentSubmissionsQuery(
    () => props.classId,
    () => props.assignmentId,
    () => props.group.originalGroupNo,  // Using the classId for both class and group-related data
    () => true
);
</script>

<template>
    <using-query-result
        :query-result="submissionsQuery"
        v-slot="{ data }: { data: SubmissionsResponse }"
    >
        <v-btn
            :color="(data.submissions.length > 0) ? 'green' : 'red'"
            variant="text"
            :to="(data.submissions.length > 0) ? goToGroupSubmissionLink(props.group.groupNo) : undefined"
        >
            {{ (data.submissions.length > 0) ? t("see-submission") :  t("no-submission")}}
        </v-btn>
    </using-query-result>
</template>
