<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    import { computed, ref, watch, type Ref } from 'vue';
    import JsonEditorVue from 'json-editor-vue'
    import { useDeleteLearningPathMutation, usePostLearningPathMutation, usePutLearningPathMutation } from '@/queries/learning-paths';
    import { Language } from '@/data-objects/language';
    import type { LearningPath } from '@dwengo-1/common/interfaces/learning-content';
    import type { AxiosError } from 'axios';

    const { t } = useI18n();

    const props = defineProps<{
        selectedLearningPath?: LearningPath
    }>();

    const { isPending, mutate, error: deleteError, isSuccess: deleteSuccess } = useDeleteLearningPathMutation();

    const DEFAULT_LEARNING_PATH: LearningPath = {
        language: 'en',
        hruid: '...',
        title: '...',
        description: '...',
        nodes: [
            {
                learningobject_hruid: '...',
                language: Language.English,
                version: 1,
                start_node: true,
                transitions: [
                    {
                        default: true,
                        condition: "(remove if the transition should be unconditinal)",
                        next: {
                            hruid: '...',
                            version: 1,
                            language: '...'
                        }
                    }
                ]
            }
        ],
        keywords: 'Keywords separated by spaces',
        target_ages: []
    }

    const { isPending: isPostPending, error: postError, mutate: doPost } = usePostLearningPathMutation();
    const { isPending: isPutPending, error: putError, mutate: doPut } = usePutLearningPathMutation();

    const learningPath: Ref<LearningPath | string> = ref(DEFAULT_LEARNING_PATH);

    const parsedLearningPath = computed(() =>
        typeof learningPath.value === "string" ? JSON.parse(learningPath.value) as LearningPath
                                               : learningPath.value
    );

    watch(() => props.selectedLearningPath, () => learningPath.value = props.selectedLearningPath ?? DEFAULT_LEARNING_PATH);

    function uploadLearningPath(): void {
        if (props.selectedLearningPath) {
            doPut({ learningPath: parsedLearningPath.value });
        } else {
            doPost({ learningPath: parsedLearningPath.value });
        }
    }

    function deleteLearningObject(): void {
        if (props.selectedLearningPath) {
            mutate({
                hruid: props.selectedLearningPath.hruid,
                language: props.selectedLearningPath.language as Language
            });
        }
    }

    function extractErrorMessage(error: AxiosError | null): string | undefined {
        return (error?.response?.data as {error: string}).error ?? error?.message;
    }
</script>

<template>
    <v-card
        :title="props.selectedLearningPath ? t('editLearningPath') : t('newLearningPath')"
    >
        <template v-slot:text>
            <json-editor-vue v-model="learningPath"></json-editor-vue>
            <v-alert
                 v-if="postError || putError || deleteError"
                 icon="mdi mdi-alert-circle"
                 type="error"
                 :title="t('error')"
                 :text="t(extractErrorMessage(postError) || extractErrorMessage(putError) || extractErrorMessage(deleteError)!)"
            ></v-alert>
        </template>
        <template v-slot:actions>
            <v-btn @click="uploadLearningPath" :loading="isPostPending || isPutPending" :disabled="parsedLearningPath.hruid === DEFAULT_LEARNING_PATH.hruid">
                {{ props.selectedLearningPath ? t('saveChanges') : t('create') }}
            </v-btn>
            <v-btn @click="deleteLearningObject" :disabled="!props.selectedLearningPath">
                {{ t('delete') }}
            </v-btn>
            <v-btn
                :href="`/learningPath/${props.selectedLearningPath?.hruid}/${props.selectedLearningPath?.language}/start`"
                :disabled="!props.selectedLearningPath"
            >
                {{ t('open') }}
            </v-btn>
        </template>
    </v-card>
</template>

<style scoped>
</style>
