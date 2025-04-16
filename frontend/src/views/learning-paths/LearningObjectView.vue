<script setup lang="ts">
    import { Language } from "@/data-objects/language.ts";
    import type { UseQueryReturnType } from "@tanstack/vue-query";
    import { useLearningObjectHTMLQuery } from "@/queries/learning-objects.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import {computed, nextTick, onMounted, reactive, watch} from "vue";
    import {getGiftAdapterForType} from "@/views/learning-paths/gift-adapters/gift-adapters.ts";
    import authService from "@/services/auth/auth-service.ts";
    import {useCreateSubmissionMutation, useSubmissionsQuery} from "@/queries/submissions.ts";
    import type {SubmissionDTO} from "@dwengo-1/common/dist/interfaces/submission.d.ts";
    import type {GroupDTO} from "@dwengo-1/common/interfaces/group";
    import type {StudentDTO} from "@dwengo-1/common/interfaces/student";
    import type {LearningObjectIdentifierDTO} from "@dwengo-1/common/interfaces/learning-content";
    import type {UserProfile} from "oidc-client-ts";

    const isStudent = computed(() => authService.authState.activeRole === "student");

    const props = defineProps<{
        hruid: string;
        language: Language;
        version: number,
        group?: {forGroup: number, assignmentNo: number, classId: string}
    }>();

    const learningObjectHtmlQueryResult: UseQueryReturnType<Document, Error> = useLearningObjectHTMLQuery(
        () => props.hruid,
        () => props.language,
        () => props.version,
    );

    const currentAnswer = reactive(<(string | number | object)[]>[]);

    const {
        isPending: submissionIsPending,
        isError: submissionFailed,
        error: submissionError,
        isSuccess: submissionSuccess,
        mutate: submitSolution
    } = useCreateSubmissionMutation();

    const {
        isPending: existingSubmissionsIsPending,
        isError: existingSubmissionsFailed,
        error: existingSubmissionsError,
        isSuccess: existingSubmissionsSuccess,
        data: existingSubmissions
    } = useSubmissionsQuery(
        props.hruid,
        props.language,
        props.version,
        props.group?.classId,
        props.group?.assignmentNo,
        props.group?.forGroup,
        true
    );



    function submitCurrentAnswer(): void {
        const { forGroup, assignmentNo, classId } = props.group!;
        const currentUser: UserProfile = authService.authState.user!.profile;
        const learningObjectIdentifier: LearningObjectIdentifierDTO = {
            hruid: props.hruid,
            language: props.language as Language,
            version: props.version
        };
        const submitter: StudentDTO = {
            id: currentUser.preferred_username!,
            username: currentUser.preferred_username!,
            firstName: currentUser.given_name!,
            lastName: currentUser.family_name!
        };
        const group: GroupDTO = {
            class: classId,
            assignment: assignmentNo,
            groupNumber: forGroup
        }
        const submission: SubmissionDTO = {
            learningObjectIdentifier,
            submitter,
            group,
            content: JSON.stringify(currentAnswer)
        }
        submitSolution({ data: submission });
    }

    function forEachQuestion(
        doAction: (questionIndex: number, questionName: string, questionType: string, questionElement: Element) => void
    ) {
        const questions = document.querySelectorAll(".gift-question");
        questions.forEach(question => {
            const name = question.id.match(/gift-q(\d+)/)?.[1]
            const questionType = question.className.split(" ")
                .find(it => it.startsWith("gift-question-type"))
                ?.match(/gift-question-type-([^ ]*)/)?.[1];

            if (!name || isNaN(parseInt(name)) || !questionType) return;

            const index = parseInt(name) - 1;

            doAction(index, name, questionType, question);
        });
    }

    function attachQuestionListeners() {
        forEachQuestion((index, name, type, element) => {
            getGiftAdapterForType(type)?.installListener(
                element, (newAnswer) => currentAnswer[index] = newAnswer
            );
        });
    }

    function setAnswers(answers: (object | string | number)[]) {
        forEachQuestion((index, name, type, element) => {
            getGiftAdapterForType(type)?.setAnswer(element, answers[index]);
        });
        currentAnswer.splice(0, currentAnswer.length, ...answers);
    }

    onMounted(() => nextTick(() => attachQuestionListeners()));

    watch(learningObjectHtmlQueryResult.data, async () => {
        await nextTick();
        attachQuestionListeners();
        setAnswers([1]);
    });
</script>

<template>
    <using-query-result
        :query-result="learningObjectHtmlQueryResult as UseQueryReturnType<Document, Error>"
        v-slot="learningPathHtml: { data: Document }"
    >
        <div
            class="learning-object-container"
            v-html="learningPathHtml.data.body.innerHTML"
        ></div>
        <p>Last submissions: {{ existingSubmissions }}</p>
        <p>Your answer: {{ currentAnswer }}</p>
        <v-btn v-if="isStudent && props.group"
               prepend-icon="mdi-check"
               variant="elevated"
               :loading="submissionIsPending"
               @click="submitCurrentAnswer()"
        >
            Submit
        </v-btn>
    </using-query-result>
</template>

<style scoped>
    .learning-object-container {
        padding: 20px;
    }
    :deep(hr) {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    :deep(li) {
        margin-left: 30px;
        margin-top: 5px;
        margin-bottom: 5px;
    }
    :deep(img) {
        max-width: 80%;
    }
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
        margin-top: 10px;
    }
</style>
