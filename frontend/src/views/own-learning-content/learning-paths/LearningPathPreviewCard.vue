<script setup lang="ts">
    import UsingQueryResult from '@/components/UsingQueryResult.vue';
    import { useI18n } from 'vue-i18n';
    import type { LearningPathDTO } from '@/data-objects/learning-paths/learning-path-dto';
    import { computed, ref, watch } from 'vue';
    import JsonEditorVue from 'json-editor-vue'
import { useMutation } from '@tanstack/vue-query';
import { usePostLearningPathMutation, usePutLearningPathMutation } from '@/queries/learning-paths';

    const { t } = useI18n();

    const props = defineProps<{
        selectedLearningPath?: LearningPathDTO
    }>();

    const INDENT = 4;
    const DEFAULT_LEARNING_PATH: LearningPathDTO = {
        language: '',
        hruid: '',
        title: '',
        description: '',
        num_nodes: 0,
        num_nodes_left: 0,
        nodes: [],
        keywords: '',
        target_ages: [],
        min_age: 0,
        max_age: 0,
        __order: 0
    }

    const { isPending: isPostPending, mutate: doPost } = usePostLearningPathMutation();
    const { isPending: isPutPending, mutate: doPut } = usePutLearningPathMutation();

    const learningPath = ref(DEFAULT_LEARNING_PATH);

    watch(() => props.selectedLearningPath, () => learningPath.value = props.selectedLearningPath ?? DEFAULT_LEARNING_PATH);

    function uploadLearningPath(): void {
        if (props.selectedLearningPath) {
            doPut({ learningPath: learningPath.value });
        } else {
            doPost({ learningPath: learningPath.value });
        }
    }
</script>

<template>
    <v-card
        :title="props.selectedLearningPath ? t('editLearningPath') : t('newLearningPath')"
    >
        <template v-slot:text>
            <json-editor-vue v-model="learningPath"></json-editor-vue>
        </template>
        <template v-slot:actions>
            <v-btn @click="uploadLearningPath" :loading="isPostPending || isPutPending">{{ props.selectedLearningPath ? t('saveChanges') : t('create') }}</v-btn>
        </template>
    </v-card>
</template>

<style scoped>
</style>
