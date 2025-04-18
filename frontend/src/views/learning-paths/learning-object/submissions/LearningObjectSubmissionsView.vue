<script setup lang="ts">
    import type {SubmissionData} from "@/views/learning-paths/learning-object/submission-data";
    import type {SubmissionDTO} from "@dwengo-1/common/interfaces/submission";
    import {Language} from "@/data-objects/language.ts";
    import {useSubmissionsQuery} from "@/queries/submissions.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import SubmitButton from "@/views/learning-paths/learning-object/submissions/SubmitButton.vue";
    import {watch} from "vue";

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

    function loadSubmission(submission: SubmissionDTO) {
        emit("update:submissionData", JSON.parse(submission.content));
        console.log(`emitted: ${JSON.parse(submission.content)}`);
    }

    watch(submissionQuery.data, () => {
        const submissions = submissionQuery.data.value;
        if (submissions && submissions.length > 0) {
            loadSubmission(submissions[submissions.length - 1]);
        }
    });
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
    </using-query-result>
</template>

<style scoped>
</style>
