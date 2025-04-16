<script setup lang="ts">
    import { Language } from "@/data-objects/language.ts";
    import type { UseQueryReturnType } from "@tanstack/vue-query";
    import { useLearningObjectHTMLQuery } from "@/queries/learning-objects.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import {nextTick, onMounted, reactive, watch} from "vue";
    import {getGiftAdapterForType} from "@/views/learning-paths/gift-adapters/gift-adapters.ts";

    const props = defineProps<{ hruid: string; language: Language; version: number }>();

    const learningObjectHtmlQueryResult: UseQueryReturnType<Document, Error> = useLearningObjectHTMLQuery(
        () => props.hruid,
        () => props.language,
        () => props.version,
    );

    const currentAnswer = reactive([]);

    function forEachQuestion(
        doAction: (questionIndex: number, questionName: string, questionType: string, questionElement: Element) => void
    ) {
        const questions = document.querySelectorAll(".gift-question");
        questions.forEach(question => {
            const name = question.id.match(/gift-q(\d+)/)?.[1]
            const questionType = question.classList.values()
                .find(it => it.startsWith("gift-question-type"))
                .match(/gift-question-type-([^ ]*)/)?.[1];

            if (!name || isNaN(parseInt(name)) || !questionType) return;

            const index = parseInt(name) - 1;

            doAction(index, name, questionType, question);
        });
    }

    function attachQuestionListeners() {
        forEachQuestion((index, name, type, element) => {
            getGiftAdapterForType(type)?.installListener(
                element, (newAnswer) => currentAnswer[index] = newAnswer
            );
        });
    }

    function setAnswers(answers: (object | string | number)[]) {
        forEachQuestion((index, name, type, element) => {
            getGiftAdapterForType(type)?.setAnswer(element, answers[index]);
        });
        currentAnswer.fill(answers);
    }

    onMounted(() => nextTick(() => attachQuestionListeners()));

    watch(learningObjectHtmlQueryResult.data, async () => {
        await nextTick();
        attachQuestionListeners();
        setAnswers([1]);
    });
</script>

<template>
    <using-query-result
        :query-result="learningObjectHtmlQueryResult as UseQueryReturnType<Document, Error>"
        v-slot="learningPathHtml: { data: Document }"
    >
        <div
            class="learning-object-container"
            v-html="learningPathHtml.data.body.innerHTML"
        ></div>
        {{ currentAnswer }}
    </using-query-result>
</template>

<style scoped>
    .learning-object-container {
        padding: 20px;
    }
    :deep(hr) {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    :deep(li) {
        margin-left: 30px;
        margin-top: 5px;
        margin-bottom: 5px;
    }
    :deep(img) {
        max-width: 80%;
    }
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
        margin-top: 10px;
    }
</style>
