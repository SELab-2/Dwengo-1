<script setup lang="ts">
    import authService from "@/services/auth/auth-service.ts";
    import { computed, type ComputedRef, ref } from "vue";
    import type { GroupDTOId } from "@dwengo-1/common/interfaces/group";
    import type { QuestionData } from "@dwengo-1/common/interfaces/question";
    import type { LearningObjectIdentifierDTO } from "@dwengo-1/interfaces/learning-content";
    import { useCreateQuestionMutation } from "@/queries/questions.ts";
    import { useI18n } from "vue-i18n";
    import { AccountType } from "@dwengo-1/common/util/account-types.ts";

    const props = defineProps<{
        learningObjectHruid: string;
        learningObjectLanguage: string;
        learningObjectVersion: number;
        forGroup?: GroupDTOId | undefined;
        withTitle?: boolean;
    }>();

    const { t } = useI18n();

    const emit = defineEmits(["updated"]);

    const questionInput = ref("");

    const loID: ComputedRef<LearningObjectIdentifierDTO> = computed(() => ({
        hruid: props.learningObjectHruid as string,
        language: props.learningObjectLanguage,
        version: props.learningObjectVersion
    }));
    const createQuestionMutation = useCreateQuestionMutation(loID);

    const showQuestionBox = computed(() => authService.authState.activeRole === AccountType.Student && props.forGroup);

    function submitQuestion(): void {
        if (props.forGroup && questionInput.value !== "") {
            const questionData: QuestionData = {
                author: authService.authState.user?.profile.preferred_username,
                content: questionInput.value,
                inGroup: props.forGroup,
            };
            createQuestionMutation.mutate(questionData, {
                onSuccess: async () => {
                    questionInput.value = ""; // Clear the input field after submission
                    emit("updated");
                },
                onError: (_) => {
                    // TODO Handle error
                    // - console.error(e);
                },
            });
        }
    }
</script>

<template>
    <h3 v-if="props.withTitle && showQuestionBox">{{ t("askAQuestion") }}:</h3>
    {{ props.forGroup }}
    <div
        class="question-box"
        v-if="showQuestionBox"
    >
        <v-textarea
            :label="t('question-input-placeholder')"
            v-model="questionInput"
            class="question-field"
            density="compact"
            rows="1"
            variant="outlined"
            auto-grow
        >
            <template v-slot:append-inner>
                <v-btn
                    icon="mdi mdi-send"
                    size="small"
                    variant="plain"
                    class="question-button"
                    @click="submitQuestion"
                />
            </template>
        </v-textarea>
    </div>
</template>

<style scoped>
    .question-box {
        width: 100%;
        max-width: 400px;
        margin: 20px auto;
    }
</style>
