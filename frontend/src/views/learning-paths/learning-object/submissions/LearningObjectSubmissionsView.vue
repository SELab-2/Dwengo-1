<script setup lang="ts">
    import type {SubmissionData} from "@/views/learning-paths/learning-object/submission-data";
    import type {SubmissionDTO} from "@dwengo-1/common/interfaces/submission";
    import {Language} from "@/data-objects/language.ts";
    import {useSubmissionsQuery} from "@/queries/submissions.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import SubmitButton from "@/views/learning-paths/learning-object/submissions/SubmitButton.vue";
    import {computed, watch} from "vue";
    import LearningObjectSubmissionsTable
        from "@/views/learning-paths/learning-object/submissions/LearningObjectSubmissionsTable.vue";
    import {useI18n} from "vue-i18n";

    const { t } = useI18n();

    const props = defineProps<{
        submissionData?: SubmissionData,
        hruid: string;
        language: Language;
        version: number,
        group: {forGroup: number, assignmentNo: number, classId: string}
    }>();
    const emit = defineEmits<{
        (e: "update:submissionData", value: SubmissionData): void
    }>();

    const submissionQuery = useSubmissionsQuery(
        () => props.hruid,
        () => props.language,
        () => props.version,
        () => props.group.classId,
        () => props.group.assignmentNo,
        () => props.group.forGroup,
        () => true
    );

    function emitSubmissionData(submissionData: SubmissionData) {
        emit("update:submissionData", submissionData);
    }

    function emitSubmission(submission: SubmissionDTO) {
        emitSubmissionData(JSON.parse(submission.content));
    }

    watch(submissionQuery.data, () => {
        const submissions = submissionQuery.data.value;
        if (submissions && submissions.length > 0) {
            emitSubmission(submissions[submissions.length - 1]);
        } else {
            emitSubmissionData([]);
        }
    });

    const lastSubmission = computed<SubmissionData>(() => {
        const submissions = submissionQuery.data.value;
        if (!submissions || submissions.length === 0) {
            return undefined;
        }
        return JSON.parse(submissions[submissions.length - 1].content);
    });

    const showSubmissionTable = computed(() =>
        props.submissionData !== undefined && props.submissionData.length > 0
    );

    const showIsDoneMessage = computed(() =>
        lastSubmission.value !== undefined && lastSubmission.value.length === 0
    );
</script>

<template>
    <using-query-result :query-result="submissionQuery" v-slot="submissions: { data: SubmissionDTO[] }">
        <submit-button
            :hruid="props.hruid"
            :language="props.language"
            :version="props.version"
            :group="props.group"
            :submission-data="props.submissionData"
            :submissions="submissions.data"
        />
        <div class="submit-submissions-spacer"></div>
        <v-alert icon="mdi-check"
                 :text="t('taskCompleted')"
                 type="success"
                 variant="tonal"
                 density="compact"
                 v-if="showIsDoneMessage"
        ></v-alert>
        <learning-object-submissions-table
            v-if="submissionQuery.data && showSubmissionTable"
            :all-submissions="submissions.data"
            @submission-selected="emitSubmission"
        />
    </using-query-result>
</template>

<style scoped>
.submit-submissions-spacer {
    height: 20px;
}
</style>
