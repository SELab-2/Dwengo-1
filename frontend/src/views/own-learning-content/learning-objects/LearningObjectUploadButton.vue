<script setup lang="ts">
    import { useUploadLearningObjectMutation } from "@/queries/learning-objects";
    import { ref, watch, type Ref } from "vue";
    import { useI18n } from "vue-i18n";
    import { VFileUpload } from "vuetify/labs/VFileUpload";

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
            mutate({ learningObjectZip: fileToUpload.value });
        }
    }
</script>
<template>
    <v-dialog
        max-width="500"
        v-model="dialogOpen"
    >
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                prepend-icon="mdi mdi-plus"
                :text="t('newLearningObject')"
                v-bind="activatorProps"
                color="rgb(14, 105, 66)"
                size="large"
            >
            </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card :title="t('learningObjectUploadTitle')">
                <v-card-text>
                    <v-file-upload
                        icon="mdi-upload"
                        v-model="fileToUpload"
                        :disabled="isPending"
                    ></v-file-upload>
                    <v-alert
                        v-if="error"
                        icon="mdi mdi-alert-circle"
                        type="error"
                        :title="t('uploadFailed')"
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
<style scoped></style>
