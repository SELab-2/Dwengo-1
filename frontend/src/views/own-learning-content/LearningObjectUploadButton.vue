<script setup lang="ts">
    import { useUploadLearningObjectMutation } from '@/queries/learning-objects';
    import { ref, watch, type Ref } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { VFileUpload } from 'vuetify/labs/VFileUpload';

    const { t } = useI18n();

    const dialogOpen = ref(false);

    interface ContainsErrorString {
        error: string;
    }

    const fileToUpload: Ref<File | undefined> = ref(undefined);

    const { isPending, error, isError, isSuccess, mutate } = useUploadLearningObjectMutation();

    watch(isSuccess, (newIsSuccess) => {
        if (newIsSuccess) {
            dialogOpen.value = false;
            fileToUpload.value = undefined;
        }
    });

    function uploadFile() {
        if (fileToUpload.value) {
            mutate({learningObjectZip: fileToUpload.value});
        }
    }
</script>
<template>
    <v-dialog max-width="500" v-model="dialogOpen">
        <template v-slot:activator="{ props: activatorProps }">
            <v-fab icon="mdi mdi-plus" v-bind="activatorProps"></v-fab>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card :title="t('learning_object_upload_title')">
                <v-card-text>
                    <v-file-upload
                        :browse-text="t('upload_browse')"
                        :divider-text="t('upload_divider')"
                        icon="mdi-upload"
                        :title="t('upload_drag_and_drop')"
                        v-model="fileToUpload"
                        :disabled="isPending"
                    ></v-file-upload>
                    <v-alert
                        v-if="error"
                        icon="mdi mdi-alert-circle"
                        type="error"
                        :title="t('upload_failed')"
                        :text="t((error.response?.data as ContainsErrorString).error ?? error.message)"
                    ></v-alert>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        :text="t('cancel')"
                        @click="isActive.value = false"
                    ></v-btn>
                    <v-btn
                        :text="t('upload')"
                        @click="uploadFile()"
                        :loading="isPending"
                        :disabled="!fileToUpload"
                    ></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
<style scoped>
</style>
