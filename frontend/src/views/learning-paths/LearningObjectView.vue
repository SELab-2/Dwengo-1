<script setup lang="ts">
import {Language} from "@/data-objects/language.ts";
import {type UseQueryReturnType} from "@tanstack/vue-query";
import {useLearningObjectHTMLQuery} from "@/queries/learning-objects.ts";
import UsingQueryResult from "@/components/UsingQueryResult.vue";

const props = defineProps<{hruid: string, language: Language, version: number}>()

const learningObjectHtmlQueryResult: UseQueryReturnType<Document, Error> = useLearningObjectHTMLQuery(props.hruid, props.language, props.version);

</script>

<template>
    <using-query-result :query-result="learningObjectHtmlQueryResult as UseQueryReturnType<Document, Error>" v-slot="learningPathHtml : {data: Document}">
        <div class="learning-object-container" v-html="learningPathHtml.data.body.innerHTML"></div>
    </using-query-result>
</template>

<style scoped>
    .learning-object-container {
        margin: 20px;
    }
    :deep(hr) {
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>
