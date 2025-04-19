<script setup lang="ts">
    import type { SubmissionData } from "@/views/learning-paths/learning-object/submission-data";
    import { getGiftAdapterForType } from "@/views/learning-paths/gift-adapters/gift-adapters.ts";
    import { computed, nextTick, onMounted, watch } from "vue";
    import { copyArrayWith } from "@/utils/array-utils.ts";

    const props = defineProps<{
        learningObjectContent: Document;
        submissionData?: SubmissionData;
    }>();

    const emit = defineEmits<(e: "update:submissionData", value: SubmissionData) => void>();

    const submissionData = computed<SubmissionData | undefined>({
        get: () => props.submissionData,
        set: (v?: SubmissionData): void => {
          if (v)
            emit("update:submissionData", v)
        },
    });

    function forEachQuestion(
        doAction: (questionIndex: number, questionName: string, questionType: string, questionElement: Element) => void,
    ): void {
        const questions = document.querySelectorAll(".gift-question");
        questions.forEach((question) => {
            const name = question.id.match(/gift-q(\d+)/)?.[1];
            const questionType = question.className
                .split(" ")
                .find((it) => it.startsWith("gift-question-type"))
                ?.match(/gift-question-type-([^ ]*)/)?.[1];

            if (!name || isNaN(parseInt(name)) || !questionType) return;

            const index = parseInt(name) - 1;

            doAction(index, name, questionType, question);
        });
    }

    function attachQuestionListeners(): void {
        forEachQuestion((index, _name, type, element) => {
            getGiftAdapterForType(type)?.installListener(element, (newAnswer) => {
                submissionData.value = copyArrayWith(index, newAnswer, submissionData.value ?? []);
            });
        });
    }

    function setAnswers(answers: SubmissionData): void {
        forEachQuestion((index, _name, type, element) => {
            const answer = answers[index];
            if (answer !== null && answer !== undefined) {
                getGiftAdapterForType(type)?.setAnswer(element, answer);
            } else if (answer === undefined) {
                answers[index] = null;
            }
        });
        submissionData.value = answers;
    }

    onMounted(async () =>
        nextTick(() => {
            attachQuestionListeners();
            setAnswers(props.submissionData ?? []);
        }),
    );

    watch(
        () => props.learningObjectContent,
        async () => {
            await nextTick();
            attachQuestionListeners();
        },
    );
    watch(
        () => props.submissionData,
        async () => {
            await nextTick();
            setAnswers(props.submissionData ?? []);
        },
    );
</script>

<template>
    <div
        class="learning-object-container"
        v-html="learningObjectContent.body.innerHTML"
    ></div>
</template>

<style scoped></style>
