<script setup lang="ts">
    import authService from "@/services/auth/auth-service.ts";
    import { Language } from "@/data-objects/language.ts";
    import { computed, type ComputedRef, onUpdated, ref } from "vue";
    import type { AssignmentDTO } from "@dwengo-1/common/interfaces/assignment";
    import { useStudentAssignmentsQuery, useStudentGroupsQuery } from "@/queries/students.ts";
    import type { GroupDTO, GroupDTOId } from "@dwengo-1/common/interfaces/group";
    import type { QuestionData } from "@dwengo-1/common/interfaces/question";
    import type { LearningObjectIdentifierDTO } from "@dwengo-1/interfaces/learning-content";
    import { useCreateQuestionMutation, useQuestionsQuery } from "@/queries/questions.ts";
    import { LearningPathNode } from "@/data-objects/learning-paths/learning-path-node.ts";
    import { useGetLearningPathQuery } from "@/queries/learning-paths.ts";
    import { useLearningObjectListForPathQuery } from "@/queries/learning-objects.ts";
    import { useI18n } from "vue-i18n";
    import { AccountType } from "@dwengo-1/common/util/account-types.ts";

    const props = defineProps<{
        hruid: string;
        language: Language;
        learningObjectHruid?: string;
        forGroup?: GroupDTOId | undefined;
        withTitle?: boolean;
    }>();

    const { t } = useI18n();

    const emit = defineEmits(["updated"]);

    const studentAssignmentsQueryResult = useStudentAssignmentsQuery(
        authService.authState.user?.profile.preferred_username,
    );
    const learningPathQueryResult = useGetLearningPathQuery(props.hruid, props.language, props.forGroup);
    const learningObjectListQueryResult = useLearningObjectListForPathQuery(learningPathQueryResult.data);

    const pathIsAssignment = computed(() => {
        const assignments = (studentAssignmentsQueryResult.data.value?.assignments as AssignmentDTO[]) || [];
        return assignments.some(
            (assignment) => assignment.learningPath === props.hruid && assignment.language === props.language,
        );
    });

    const nodesList: ComputedRef<LearningPathNode[] | null> = computed(
        () => learningPathQueryResult.data.value?.nodesAsList ?? null,
    );

    const currentNode = computed(() => {
        const currentHruid = props.learningObjectHruid;
        return nodesList.value?.find((it) => it.learningobjectHruid === currentHruid);
    });

    const getQuestionsQuery = useQuestionsQuery(
        computed(
            () =>
                ({
                    language: currentNode.value?.language,
                    hruid: currentNode.value?.learningobjectHruid,
                    version: currentNode.value?.version,
                }) as LearningObjectIdentifierDTO,
        ),
    );

    const questionInput = ref("");

    const loID: ComputedRef<LearningObjectIdentifierDTO> = computed(() => ({
        hruid: props.learningObjectHruid as string,
        language: props.language,
    }));
    const createQuestionMutation = useCreateQuestionMutation(loID);
    const groupsQueryResult = useStudentGroupsQuery(authService.authState.user?.profile.preferred_username);

    const showQuestionBox = computed(
        () => authService.authState.activeRole === AccountType.Student && pathIsAssignment.value,
    );

    function submitQuestion(): void {
        const assignments = studentAssignmentsQueryResult.data.value?.assignments as AssignmentDTO[];
        const assignment = assignments.find(
            (assignment) => assignment.learningPath === props.hruid && assignment.language === props.language,
        );
        const groups = groupsQueryResult.data.value?.groups as GroupDTO[];
        const group = groups?.find((group) => group.assignment === assignment?.id) as GroupDTO;
        const questionData: QuestionData = {
            author: authService.authState.user?.profile.preferred_username,
            content: questionInput.value,
            inGroup: group,
        };
        if (questionInput.value !== "") {
            createQuestionMutation.mutate(questionData, {
                onSuccess: async () => {
                    questionInput.value = ""; // Clear the input field after submission
                    await getQuestionsQuery.refetch(); // Reload the questions
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
