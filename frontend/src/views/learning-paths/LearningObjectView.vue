<script setup lang="ts">
import {Language} from "@/services/learning-content/language.ts";
import {watch} from "vue";
import {getLearningObjectHTML} from "@/services/learning-content/learning-object-service.ts";
import UsingRemoteResource from "@/components/UsingRemoteResource.vue";
import {loadResource, remoteResource} from "@/services/api-client/remote-resource.ts";

const props = defineProps<{hruid: string, language: Language, version: number}>()

const learningPathHtmlResource = remoteResource<Document>();
watch(props, () => {
    loadResource(learningPathHtmlResource, getLearningObjectHTML(props.hruid, props.language, props.version))
}, {immediate: true});

</script>

<template>
    <using-remote-resource :resource="learningPathHtmlResource" v-slot="learningPathHtml : {data: Document}">
        <div class="learning-object-container" v-html="learningPathHtml.data.body.innerHTML"></div>
    </using-remote-resource>
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
