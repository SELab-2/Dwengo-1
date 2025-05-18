<script setup lang="ts">
    import { useAnswersQuery, useCreateAnswerMutation } from "@/queries/answers";
    import type { QuestionDTO, QuestionId } from "@dwengo-1/common/interfaces/question";
    import { computed, ref } from "vue";
    import UsingQueryResult from "./UsingQueryResult.vue";
    import type { AnswersResponse } from "@/controllers/answers";
    import type { AnswerData, AnswerDTO } from "@dwengo-1/common/interfaces/answer";
    import authService from "@/services/auth/auth-service";
    import { useI18n } from "vue-i18n";
    import { AccountType } from "@dwengo-1/common/util/account-types"

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
                    await answersQuery.refetch();
                },
            });
        }
    }
</script>
<template>
    <div class="space-y-4">
        <div
            class="flex justify-between items-center mb-2"
            style="
                margin-right: 5px;
                margin-left: 5px;
                font-weight: bold;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            "
        >
            <span class="font-semibold text-lg text-gray-800">{{
                question.author.firstName + " " + question.author.lastName
            }}</span>
            <span class="text-sm text-gray-500">{{ formatDate(question.timestamp) }}</span>
        </div>

        <div
            class="text-gray-700 mb-3"
            style="margin-left: 10px"
        >
            {{ question.content }}
        </div>
        <div
            v-if="authService.authState.activeRole === AccountType.Teacher"
            class="answer-input-container"
        >
            <input
                v-model="answer"
                type="text"
                :placeholder="t('answer-input-placeholder')"
                class="answer-input"
            />
            <button
                @click="submitAnswer"
                class="submit-button"
            >
                ▶
            </button>
        </div>
        <using-query-result
            :query-result="answersQuery"
            v-slot="answersResponse: { data: AnswersResponse }"
        >
            <button
                v-if="answersResponse.data.answers && answersResponse.data.answers.length > 0"
                @click="toggle()"
                class="toggle-answers-btn"
            >
                {{ expanded ? t("answers-toggle-hide") : t("answers-toggle-show") }}
            </button>

            <div
                v-show="expanded"
                ref="answersContainer"
                class="mt-3 pl-4 border-l-2 border-blue-200 space-y-2"
            >
                <div
                    v-for="(answer, answerIndex) in answersResponse.data.answers as AnswerDTO[]"
                    :key="answerIndex"
                    class="text-gray-600"
                >
                    <v-divider :thickness="2" />
                    <div
                        class="flex justify-between items-center mb-2"
                        style="
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                        "
                    >
                        <span class="font-semibold text-lg text-gray-800">{{ answer.author.username }}</span>
                        <span class="text-sm text-gray-500">{{ formatDate(answer.timestamp) }}</span>
                    </div>

                    <div
                        class="text-gray-700 mb-3"
                        style="margin-left: 10px"
                    >
                        {{ answer.content }}
                    </div>
                </div>
            </div>
        </using-query-result>
    </div>
</template>
<style scoped>
    .toggle-answers-btn {
        font-size: 0.875rem;
        text-decoration: none;
        background-color: #f0f4ff; /* subtle blue background */
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .toggle-answers-btn:hover {
        background-color: #e0eaff; /* slightly darker on hover */
        text-decoration: underline;
    }
    .answer-input-container {
        margin: 5px;
    }
    .answer-input {
        flex-grow: 1;
        outline: none;
        border: none;
        background: transparent;
        color: #374151; /* gray-700 */
        font-size: 0.875rem; /* smaller font size */
    }

    .answer-input::placeholder {
        color: #9ca3af; /* gray-400 */
    }

    .submit-button {
        margin-left: 0.25rem;
        padding: 0.25rem;
        background-color: #f3f4f6; /* gray-100 */
        border-radius: 9999px;
        transition: background-color 0.2s;
        border: none;
        cursor: pointer;
    }

    .submit-button:hover {
        background-color: #e5e7eb; /* gray-200 */
    }

    .submit-icon {
        width: 0.75rem;
        height: 0.75rem;
        color: #4b5563; /* gray-600 */
    }
    .answer-input-container {
        display: flex;
        align-items: center;
        border: 1px solid #d1d5db; /* gray-300 */
        border-radius: 9999px;
        padding: 0.5rem 1rem;
        max-width: 28rem;
        width: 100%;
    }
</style>
