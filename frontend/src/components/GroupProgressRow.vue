<script setup lang="ts">
import { useGetLearningPathQuery } from "@/queries/learning-paths.ts";
import { computed } from "vue";
import type { Language } from "@/data-objects/language.ts";
import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";

const props = defineProps<{
    groupNumber: number;
    learningPath: string;
    language: Language;
    assignmentId: number;
    classId: string;
}>();

function calculateProgress(lp: LearningPath): number {
    return ((lp.amountOfNodes - lp.amountOfNodesLeft) / lp.amountOfNodes) * 100;
}

const query = useGetLearningPathQuery(
    () => props.learningPath,
    () => props.language,
    () => ({
        forGroup: props.groupNumber,
        assignmentNo: props.assignmentId,
        classId: props.classId,
    }),
);

const progress = computed(() => {
    if (!query.data.value) return 0;
    return calculateProgress(query.data.value);
});
</script>

<template>
    <v-progress-linear
        :model-value="progress"
        color="blue-grey"
        height="25"
    >
        <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
        </template>
    </v-progress-linear>
</template>
