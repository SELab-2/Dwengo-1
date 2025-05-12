<script setup lang="ts">
    import LearningPathPreviewCard from './LearningPathPreviewCard.vue';
    import { computed, ref, type Ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import type { LearningPathDTO } from '@/data-objects/learning-paths/learning-path-dto';

    const { t } = useI18n();
    const props = defineProps<{
        learningPaths: LearningPathDTO[]
    }>();

    const tableHeaders = [
        { title: t("hruid"), width: "250px", key: "key" },
        { title: t("language"), width: "50px", key: "language" },
        { title: t("title"), key: "title" }
    ];

    const selectedLearningPaths: Ref<LearningPathDTO[]> = ref([]);

    const selectedLearningPath = computed(() =>
        selectedLearningPaths.value ? selectedLearningPaths.value[0] : undefined
    );

</script>

<template>
    <div class="root">
        <v-data-table
            class="table"
            v-model="selectedLearningPaths"
            :items="props.learningPaths"
            :headers="tableHeaders"
            select-strategy="single"
            show-select
            return-object
        />
        <learning-path-preview-card class="preview" :selectedLearningPath="selectedLearningPath"/>
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
    .preview {
        flex: 1;
        min-width: 400px;
    }
    .table {
        flex: 1;
    }
</style>
