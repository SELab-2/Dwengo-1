<script setup lang="ts">
    import type { QuestionDTO } from "@dwengo-1/common/interfaces/question";
    import SingleQuestion from "./SingleQuestion.vue";

    defineProps<{
        questions: QuestionDTO[];
    }>();
</script>
<template>
    <div class="space-y-4">
        <div
            v-for="(question) in questions"
            :key="(question.sequenceNumber, question.content)"
            class="border rounded-2xl p-4 shadow-sm bg-white"
        >
            <SingleQuestion :question="question"></SingleQuestion>

        
        </div>
    </div>
</template>
<style scoped></style>
