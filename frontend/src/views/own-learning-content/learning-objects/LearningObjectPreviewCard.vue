<script setup lang="ts">
    import type { LearningObject } from "@/data-objects/learning-objects/learning-object";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import LearningObjectContentView from "../../learning-paths/learning-object/content/LearningObjectContentView.vue";
    import ButtonWithConfirmation from "@/components/ButtonWithConfirmation.vue";
    import { useDeleteLearningObjectMutation, useLearningObjectHTMLQuery } from "@/queries/learning-objects";
    import { useI18n } from "vue-i18n";

    const { t } = useI18n();

    const props = defineProps<{
        selectedLearningObject?: LearningObject;
    }>();

    const learningObjectQueryResult = useLearningObjectHTMLQuery(
        () => props.selectedLearningObject?.key,
        () => props.selectedLearningObject?.language,
        () => props.selectedLearningObject?.version,
    );

    const { isPending, mutate } = useDeleteLearningObjectMutation();

    function deleteLearningObject(): void {
        if (props.selectedLearningObject) {
            mutate({
                hruid: props.selectedLearningObject.key,
                language: props.selectedLearningObject.language,
                version: props.selectedLearningObject.version,
            });
        }
    }
</script>

<template>
    <v-card
        v-if="selectedLearningObject"
        :title="t('previewFor') + selectedLearningObject.title"
    >
        <template v-slot:text>
            <using-query-result
                :query-result="learningObjectQueryResult"
                v-slot="response: { data: Document }"
            >
                <learning-object-content-view :learning-object-content="response.data"></learning-object-content-view>
            </using-query-result>
        </template>
        <template v-slot:actions>
            <button-with-confirmation
                @confirm="deleteLearningObject"
                prepend-icon="mdi mdi-delete"
                color="red"
                :text="t('delete')"
                :confirmQueryText="t('learningObjectDeleteQuery')"
            />
        </template>
    </v-card>
</template>

<style scoped></style>
