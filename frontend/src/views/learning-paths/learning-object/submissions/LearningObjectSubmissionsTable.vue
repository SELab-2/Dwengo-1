<script setup lang="ts">
    import type {SubmissionDTO} from "@dwengo-1/common/interfaces/submission";
    import {computed} from "vue";
    import {useI18n} from "vue-i18n";

    const { t } = useI18n();

    const props = defineProps<{
        allSubmissions: SubmissionDTO[]
    }>();
    const emit = defineEmits<{
        (e: "submission-selected", submission: SubmissionDTO): void
    }>();

    const headers = computed(() => [
        { title: "#", value: "submissionNo", width: "50px" },
        { title: t("submittedBy"), value: "submittedBy" },
        { title: t("timestamp"), value: "timestamp"},
        { title: "", key: "action", width: "70px", sortable: false },
    ]);

    const data = computed(() => props.allSubmissions.map(submission => ({
        submissionNo: submission.submissionNumber,
        submittedBy: `${submission.submitter.firstName} ${submission.submitter.lastName}`,
        timestamp: submission.time ? new Date(submission.time).toLocaleString(): "-",
        dto: submission
    })));

    function selectSubmission(submission: SubmissionDTO) {
        emit('submission-selected', submission);
    }
</script>

<template>
    <v-card>
        <v-card-title>{{ t("groupSubmissions") }}</v-card-title>
        <v-card-text>
            <v-data-table :headers="headers"
                          :items="data"
                          density="compact"
                          hide-default-footer
            >
                <template v-slot:item.action="{ item }">
                    <v-btn density="compact" variant="plain" @click="selectSubmission(item.dto)">
                        {{ t("loadSubmission") }}
                    </v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<style scoped>

</style>
