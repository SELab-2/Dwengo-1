<script setup lang="ts">
import { useGetLearningPathQuery } from "@/queries/learning-paths.ts";
import { computed } from "vue";
import type { Language } from "@/data-objects/language.ts";
import {calculateProgress} from "@/utils/assignment-utils.ts";

const props = defineProps<{
    groupNumber: number;
    learningPath: string;
    language: Language;
    assignmentId: number;
    classId: string;
}>();

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

const progressColor = computed(() => {
    if (progress.value < 50) return "error";
    if (progress.value < 80) return "warning";
    return "success";
});
</script>

<template>
    <v-progress-linear
        :model-value="progress"
        :color="progressColor"
        height="25"
    >
        <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
        </template>
    </v-progress-linear>
</template>
