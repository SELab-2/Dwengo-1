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
            v-if="questions.length !=0"
            v-for="question in questions"
            :key="(question.sequenceNumber, question.content)"
            class="border rounded-2xl p-4 shadow-sm bg-white"
        >
            <SingleQuestion :question="question"></SingleQuestion>
        </div>
        <div v-else>
            <p class="no-questions">No questions asked yet</p>
        </div>
    </div>
</template>
<style scoped>
.no-questions {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40vh;
    text-align: center;
    font-size: 18px;
    color: #666;
    padding: 0 20px;
}
</style>
