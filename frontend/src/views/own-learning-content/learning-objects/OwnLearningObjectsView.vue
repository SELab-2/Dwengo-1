<script setup lang="ts">
    import type { LearningObject } from "@/data-objects/learning-objects/learning-object";
    import LearningObjectUploadButton from "@/views/own-learning-content/learning-objects/LearningObjectUploadButton.vue";
    import LearningObjectPreviewCard from "./LearningObjectPreviewCard.vue";
    import { computed, ref, watch, type Ref } from "vue";
    import { useI18n } from "vue-i18n";

    const { t } = useI18n();
    const props = defineProps<{
        learningObjects: LearningObject[];
    }>();

    const tableHeaders = [
        { title: t("hruid"), width: "250px", key: "key" },
        { title: t("language"), width: "50px", key: "language" },
        { title: t("version"), width: "50px", key: "version" },
        { title: t("title"), key: "title" },
    ];

    const selectedLearningObjects: Ref<LearningObject[]> = ref([]);

    watch(
        () => props.learningObjects,
        () => (selectedLearningObjects.value = []),
    );

    const selectedLearningObject = computed(() =>
        selectedLearningObjects.value ? selectedLearningObjects.value[0] : undefined,
    );
</script>

<template>
    <div class="root">
        <div class="table-container">
            <learning-object-upload-button />
            <v-data-table
                class="table"
                v-model="selectedLearningObjects"
                :items="props.learningObjects"
                :headers="tableHeaders"
                select-strategy="single"
                show-select
                return-object
            />
        </div>
        <div
            class="preview-container"
            v-if="selectedLearningObject"
        >
            <learning-object-preview-card
                class="preview"
                :selectedLearningObject="selectedLearningObject"
            />
        </div>
    </div>
</template>

<style scoped>
    .root {
        display: flex;
        gap: 20px;
        padding: 20px;
        flex-wrap: wrap;
    }
    .preview-container {
        flex: 1;
        min-width: 400px;
    }
    .table-container {
        flex: 1;
    }
    .preview {
        width: 100%;
    }
    .table {
        width: 100%;
        margin-top: 20px;
    }
</style>
