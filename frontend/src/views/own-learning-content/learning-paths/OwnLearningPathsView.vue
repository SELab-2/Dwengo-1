<script setup lang="ts">
    import LearningPathPreviewCard from "./LearningPathPreviewCard.vue";
    import { computed, ref, watch, type Ref } from "vue";
    import { useI18n } from "vue-i18n";
    import type { LearningPath as LearningPathDTO } from "@dwengo-1/common/interfaces/learning-content";

    const { t } = useI18n();
    const props = defineProps<{
        learningPaths: LearningPathDTO[];
    }>();

    const tableHeaders = [
        { title: t("hruid"), width: "250px", key: "hruid" },
        { title: t("language"), width: "50px", key: "language" },
        { title: t("title"), key: "title" },
    ];

    const selectedLearningPaths: Ref<LearningPathDTO[]> = ref([]);

    const selectedLearningPath = computed(() =>
        selectedLearningPaths.value ? selectedLearningPaths.value[0] : undefined,
    );

    watch(
        () => props.learningPaths,
        () => (selectedLearningPaths.value = []),
    );
</script>

<template>
    <div class="root">
        <div class="table-container">
            <v-data-table
                class="table"
                v-model="selectedLearningPaths"
                :items="props.learningPaths"
                :headers="tableHeaders"
                select-strategy="single"
                show-select
                return-object
            />
        </div>
        <div class="preview-container">
            <learning-path-preview-card
                class="preview"
                :selectedLearningPath="selectedLearningPath"
            />
        </div>
    </div>
</template>

<style scoped>
    .fab {
        position: absolute;
        right: 20px;
        bottom: 20px;
    }
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
    }
</style>
