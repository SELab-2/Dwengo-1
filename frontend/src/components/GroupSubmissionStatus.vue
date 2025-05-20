<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import type { SubmissionsResponse } from "@/controllers/submissions.ts";
    import { ref, watch } from "vue";
    import { useGetLearningPathQuery } from "@/queries/learning-paths.ts";

    const props = defineProps<{
        learningPathHruid: string;
        language: string;
        group: object;
        assignmentId: number;
        classId: string;
        goToGroupSubmissionLink: (groupNo: number) => void;
    }>();

    const emit = defineEmits<(e: "update:hasSubmission", hasSubmission: boolean) => void>();

    const { t } = useI18n();
    const hasMadeProgress = ref(false);

    const getLearningPathQuery = useGetLearningPathQuery(
        () => props.learningPathHruid,
        () => props.language,
        () => ({
            forGroup: props.group.originalGroupNo,
            assignmentNo: props.assignmentId,
            classId: props.classId,
        }),
    );

    watch(
        () => getLearningPathQuery.data.value,
        (learningPath) => {
            if (learningPath) {
                hasMadeProgress.value = learningPath.amountOfNodes !== learningPath.amountOfNodesLeft;
                emit("update:hasSubmission", hasMadeProgress.value);
            }
        },
        { immediate: true },
    );
</script>

<template>
    <using-query-result
        :query-result="getLearningPathQuery"
        v-slot="{ data }: { data: SubmissionsResponse }"
    >
        <v-btn
            :color="hasMadeProgress ? 'green' : 'red'"
            variant="text"
            :to="hasMadeProgress ? goToGroupSubmissionLink(props.group.originalGroupNo) : undefined"
            :disabled="!hasMadeProgress"
        >
            {{ hasMadeProgress ? t("submission") : t("noSubmissionsYet") }}
        </v-btn>
    </using-query-result>
</template>
