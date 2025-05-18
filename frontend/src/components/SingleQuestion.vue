<script setup lang="ts">
    import { useAnswersQuery, useCreateAnswerMutation } from "@/queries/answers";
    import type { QuestionDTO, QuestionId } from "@dwengo-1/common/interfaces/question";
    import { computed, ref } from "vue";
    import UsingQueryResult from "./UsingQueryResult.vue";
    import type { AnswersResponse } from "@/controllers/answers";
    import type { AnswerData, AnswerDTO } from "@dwengo-1/common/interfaces/answer";
    import type { UserDTO } from "@dwengo-1/common/interfaces/user";
    import authService from "@/services/auth/auth-service";
    import { useI18n } from "vue-i18n";
    import { AccountType } from "@dwengo-1/common/util/account-types";

    const { t } = useI18n();

    const props = defineProps<{
        question: QuestionDTO;
    }>();

    const expanded = ref(false);
    const answersContainer = ref<HTMLElement | null>(null); // Ref for the answers container

    function toggle(): void {
        expanded.value = !expanded.value;

        // Scroll to the answers container if expanded
        if (expanded.value && answersContainer.value) {
            setTimeout(() => {
                if (answersContainer.value) {
                    answersContainer.value.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }, 100);
        }
    }

    function formatDate(timestamp: string | Date): string {
        return new Date(timestamp).toLocaleString();
    }

    const answersQuery = useAnswersQuery(
        computed(
            () =>
                ({
                    learningObjectIdentifier: props.question.learningObjectIdentifier,
                    sequenceNumber: props.question.sequenceNumber,
                }) as QuestionId,
        ),
    );

    const questionId: QuestionId = {
        learningObjectIdentifier: props.question.learningObjectIdentifier,
        sequenceNumber: props.question.sequenceNumber as number,
    };
    const createAnswerMutation = useCreateAnswerMutation(questionId);

    const answer = ref("");

    function submitAnswer(): void {
        const answerData: AnswerData = {
            author: authService.authState.user?.profile.preferred_username as string,
            content: answer.value,
        };
        if (answer.value !== "") {
            createAnswerMutation.mutate(answerData, {
                onSuccess: async () => {
                    answer.value = "";
                    expanded.value = true;
                    await answersQuery.refetch();
                },
            });
        }
    }

    function displayNameFor(user: UserDTO) {
        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        } else {
            return user.username;
        }
    }
</script>
<template>
    <div class="space-y-4">
        <v-card class="question-card">
            <v-card-title class="author-title">{{ displayNameFor(question.author) }}</v-card-title>
            <v-card-subtitle>{{ formatDate(question.timestamp) }}</v-card-subtitle>
            <v-card-text>
                {{ question.content }}
            </v-card-text>
            <template
                v-slot:actions
                v-if="
                    authService.authState.activeRole === AccountType.Teacher ||
                    answersQuery.data?.value?.answers?.length > 0
                "
            >
                <div class="question-actions-container">
                    <v-textarea
                        v-if="authService.authState.activeRole === AccountType.Teacher"
                        :label="t('answer-input-placeholder')"
                        v-model="answer"
                        class="answer-field"
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
                                class="answer-button"
                                @click="submitAnswer"
                            />
                        </template>
                    </v-textarea>
                    <using-query-result
                        :query-result="answersQuery"
                        v-slot="answersResponse: { data: AnswersResponse }"
                    >
                        <v-btn
                            v-if="answersResponse.data.answers && answersResponse.data.answers.length > 0"
                            @click="toggle()"
                        >
                            {{ expanded ? t("answers-toggle-hide") : t("answers-toggle-show") }}
                        </v-btn>

                        <div
                            v-show="expanded"
                            ref="answersContainer"
                            class="mt-3 pl-4 border-l-2 border-blue-200 space-y-2"
                        >
                            <v-card
                                v-for="(answer, answerIndex) in answersResponse.data.answers as AnswerDTO[]"
                                :key="answerIndex"
                                class="answer-card"
                            >
                                <v-card-title class="author-title">{{ displayNameFor(answer.author) }}</v-card-title>
                                <v-card-subtitle>{{ formatDate(answer.timestamp) }}</v-card-subtitle>
                                <v-card-text>
                                    {{ answer.content }}
                                </v-card-text>
                            </v-card>
                        </div>
                    </using-query-result>
                </div>
            </template>
        </v-card>
    </div>
</template>
<style scoped>
    .answer-field {
        max-width: 500px;
    }

    .answer-button {
        margin: auto;
    }

    .answer-input-container {
        margin: 5px;
    }

    .question-card {
        margin: 10px;
    }

    .question-actions-container {
        width: 100%;
        margin-left: 10px;
        margin-right: 10px;
    }

    .answer-card {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .author-title {
        font-size: 14pt;
        margin-bottom: -10px;
    }
</style>
