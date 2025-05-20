<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import { computed, ref, watch, type Ref } from "vue";
    import JsonEditorVue from "json-editor-vue";
    import ButtonWithConfirmation from "@/components/ButtonWithConfirmation.vue";
    import {
        useDeleteLearningPathMutation,
        usePostLearningPathMutation,
        usePutLearningPathMutation,
    } from "@/queries/learning-paths";
    import { Language } from "@/data-objects/language";
    import type { LearningPath } from "@dwengo-1/common/interfaces/learning-content";
    import type { AxiosError } from "axios";
    import { parse } from "uuid";

    const { t } = useI18n();

    const props = defineProps<{
        selectedLearningPath?: LearningPath;
    }>();

    const { isPending, mutate, error: deleteError, isSuccess: deleteSuccess } = useDeleteLearningPathMutation();

    const DEFAULT_LEARNING_PATH: Partial<LearningPath> = {
        language: "en",
        hruid: "...",
        title: "...",
        description: "...",
        nodes: [
            {
                learningobject_hruid: "...",
                language: Language.English,
                version: 1,
                start_node: true,
                transitions: [
                    {
                        default: true,
                        condition: t("hintRemoveIfUnconditionalTransition"),
                        next: {
                            hruid: "...",
                            version: 1,
                            language: "...",
                        },
                    },
                ],
            },
        ],
    };

    const { isPending: isPostPending, error: postError, mutate: doPost } = usePostLearningPathMutation();
    const { isPending: isPutPending, error: putError, mutate: doPut } = usePutLearningPathMutation();

    const learningPath: Ref<Partial<LearningPath> | string> = ref(DEFAULT_LEARNING_PATH);

    const parsedLearningPath = computed(() =>
        typeof learningPath.value === "string" ? (JSON.parse(learningPath.value) as LearningPath) : learningPath.value,
    );

    watch(
        () => props.selectedLearningPath,
        () => (learningPath.value = props.selectedLearningPath ?? DEFAULT_LEARNING_PATH),
    );

    function uploadLearningPath(): void {
        if (props.selectedLearningPath) {
            doPut({ learningPath: parsedLearningPath.value });
        } else {
            doPost({ learningPath: parsedLearningPath.value });
        }
    }

    function deleteLearningPath(): void {
        if (props.selectedLearningPath) {
            mutate({
                hruid: props.selectedLearningPath.hruid,
                language: props.selectedLearningPath.language as Language,
            });
        }
    }

    function extractErrorMessage(error: AxiosError): string {
        return (error.response?.data as { error: string }).error ?? error.message;
    }

    const isIdModified = computed(
        () =>
            props.selectedLearningPath !== undefined &&
            (props.selectedLearningPath.hruid !== parsedLearningPath.value.hruid ||
                props.selectedLearningPath.language !== parsedLearningPath.value.language),
    );

    const selectedLearningPathLink = computed(() => {
        if (!props.selectedLearningPath) {
            return undefined;
        }
        const { hruid, language } = props.selectedLearningPath;
        const startNode = props.selectedLearningPath.nodes.find((it) => it.start_node);
        return `/learningPath/${hruid}/${language}/${startNode.learningobject_hruid}`;
    });

    function getErrorMessage(): string | null {
        if (postError.value) {
            return t(extractErrorMessage(postError.value));
        } else if (putError.value) {
            return t(extractErrorMessage(putError.value));
        } else if (deleteError.value) {
            return t(extractErrorMessage(deleteError.value));
        } else if (isIdModified.value) {
            return t("learningPathCantModifyId");
        }
        return null;
    }
</script>

<template>
    <v-card>
        <template v-slot:title>
            <div class="title-container">
                <span class="title">{{
                    props.selectedLearningPath ? t("editLearningPath") : t("newLearningPath")
                }}</span>
                <span class="actions">
                    <v-btn
                        @click="uploadLearningPath"
                        prependIcon="mdi mdi-check"
                        :loading="isPostPending || isPutPending"
                        :disabled="parsedLearningPath.hruid === DEFAULT_LEARNING_PATH.hruid || isIdModified"
                        variant="text"
                    >
                        {{ props.selectedLearningPath ? t("saveChanges") : t("create") }}
                    </v-btn>
                    <button-with-confirmation
                        @confirm="deleteLearningPath"
                        :disabled="!props.selectedLearningPath"
                        :text="t('delete')"
                        color="red"
                        prependIcon="mdi mdi-delete"
                        :confirmQueryText="t('learningPathDeleteQuery')"
                        variant="text"
                    />
                    <v-btn
                        :href="selectedLearningPathLink"
                        target="_blank"
                        prepend-icon="mdi mdi-open-in-new"
                        :disabled="!props.selectedLearningPath"
                        variant="text"
                    >
                        {{ t("open") }}
                    </v-btn>
                </span>
            </div>
        </template>
        <template v-slot:text>
            <json-editor-vue v-model="learningPath"></json-editor-vue>
            <v-alert
                v-if="postError || putError || deleteError || isIdModified"
                icon="mdi mdi-alert-circle"
                type="error"
                :title="t('error')"
                :text="getErrorMessage()!"
            ></v-alert>
        </template>
    </v-card>
</template>

<style scoped>
    .title-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .title {
        flex: 1;
    }
    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
</style>
