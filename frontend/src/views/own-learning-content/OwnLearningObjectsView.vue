<script setup lang="ts">
    import type { LearningObject } from '@/data-objects/learning-objects/learning-object';
    import LearningObjectUploadButton from '@/views/own-learning-content/LearningObjectUploadButton.vue'
    import LearningObjectContentView from '../learning-paths/learning-object/content/LearningObjectContentView.vue';
    import { computed, ref, type Ref } from 'vue';
    import { useI18n } from 'vue-i18n';
import { useLearningObjectHTMLQuery } from '@/queries/learning-objects';
import UsingQueryResult from '@/components/UsingQueryResult.vue';

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

    const selectedLearningObjects: Ref<LearningObject[]> = ref([])

    const selectedLearningObject = computed(() =>
        selectedLearningObjects.value ? selectedLearningObjects.value[0] : undefined
    )

    const learningObjectQueryResult = useLearningObjectHTMLQuery(
        () => selectedLearningObject.value?.key,
        () => selectedLearningObject.value?.language,
        () => selectedLearningObject.value?.version
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
        <v-card
            class="preview"
            v-if="selectedLearningObjects.length > 0"
            :title="t('preview_for') + selectedLearningObjects[0].title"
        >
            <template v-slot:text>
                <using-query-result :query-result="learningObjectQueryResult" v-slot="response: { data: Document }">
                    <learning-object-content-view :learning-object-content="response.data"></learning-object-content-view>
                </using-query-result>
            </template>
        </v-card>
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
    }
    .preview {
        flex: 1;
    }
    .table {
        flex: 1;
    }
</style>
