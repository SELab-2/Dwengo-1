<script setup lang="ts">
    import type { LearningObject } from '@/data-objects/learning-objects/learning-object';
    import LearningObjectUploadButton from '@/views/own-learning-content/learning-objects/LearningObjectUploadButton.vue'
    import LearningObjectPreviewCard from './LearningObjectPreviewCard.vue';
    import { computed, ref, type Ref } from 'vue';
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();
    const props = defineProps<{
        learningObjects: LearningObject[]
    }>();

    const tableHeaders = [
        { title: t("hruid"), width: "250px", key: "key" },
        { title: t("language"), width: "50px", key: "language" },
        { title: t("version"), width: "50px", key: "version" },
        { title: t("title"), key: "title" }
    ];

    const selectedLearningObjects: Ref<LearningObject[]> = ref([]);

    const selectedLearningObject = computed(() =>
        selectedLearningObjects.value ? selectedLearningObjects.value[0] : undefined
    );

</script>

<template>
    <div class="root">
        <v-data-table
            class="table"
            v-model="selectedLearningObjects"
            :items="props.learningObjects"
            :headers="tableHeaders"
            select-strategy="single"
            show-select
            return-object
        />
        <learning-object-preview-card class="preview" :selectedLearningObject="selectedLearningObject"/>
    </div>
    <div class="fab">
        <learning-object-upload-button/>
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
