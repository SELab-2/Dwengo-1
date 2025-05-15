<script setup lang="ts">
    import { Language } from "@/data-objects/language.ts";
    import type { UseQueryReturnType } from "@tanstack/vue-query";
    import { useLearningObjectHTMLQuery } from "@/queries/learning-objects.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { computed, ref } from "vue";
    import authService from "@/services/auth/auth-service.ts";
    import type { SubmissionData } from "@/views/learning-paths/learning-object/submission-data";
    import LearningObjectContentView from "@/views/learning-paths/learning-object/content/LearningObjectContentView.vue";
    import LearningObjectSubmissionsView from "@/views/learning-paths/learning-object/submissions/LearningObjectSubmissionsView.vue";
    import {AccountType} from "@dwengo-1/common/util/account-types";

    const _isStudent = computed(() => authService.authState.activeRole === AccountType.Student);

    const props = defineProps<{
        hruid: string;
        language: Language;
        version: number;
        group?: { forGroup: number; assignmentNo: number; classId: string };
    }>();

    const learningObjectHtmlQueryResult: UseQueryReturnType<Document, Error> = useLearningObjectHTMLQuery(
        () => props.hruid,
        () => props.language,
        () => props.version,
    );
    const currentSubmission = ref<SubmissionData>([]);
</script>

<template>
    <using-query-result
        :query-result="learningObjectHtmlQueryResult as UseQueryReturnType<Document, Error>"
        v-slot="learningPathHtml: { data: Document }"
    >
        <learning-object-content-view
            :learning-object-content="learningPathHtml.data"
            v-model:submission-data="currentSubmission"
        />
        <div class="content-submissions-spacer" />
        <learning-object-submissions-view
            v-if="props.group"
            :group="props.group"
            :hruid="props.hruid"
            :language="props.language"
            :version="props.version"
            v-model:submission-data="currentSubmission"
        />
    </using-query-result>
</template>

<style scoped>
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
    .content-submissions-spacer {
        height: 20px;
    }
</style>
