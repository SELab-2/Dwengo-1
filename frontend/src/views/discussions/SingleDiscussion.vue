<script setup lang="ts">
import { Language } from '@/data-objects/language.ts';
import type { LearningPath } from '@/data-objects/learning-paths/learning-path.ts';
import { computed, type ComputedRef, ref, watch } from 'vue';
import type { LearningObject } from '@/data-objects/learning-objects/learning-object.ts';
import { useRoute } from 'vue-router';
import { useGetAllLearningPaths, useGetLearningPathQuery } from '@/queries/learning-paths.ts';
import { useLearningObjectListForPathQuery } from '@/queries/learning-objects.ts';
import UsingQueryResult from '@/components/UsingQueryResult.vue';
import authService from '@/services/auth/auth-service.ts';
import { LearningPathNode } from '@/data-objects/learning-paths/learning-path-node.ts';
import { useCreateQuestionMutation, useQuestionsQuery } from '@/queries/questions';
import type { QuestionsResponse } from '@/controllers/questions';
import type { LearningObjectIdentifierDTO } from '@dwengo-1/common/interfaces/learning-content';
import QandA from '@/components/QandA.vue';
import type { QuestionData, QuestionDTO } from '@dwengo-1/common/interfaces/question';
import { useStudentAssignmentsQuery, useStudentGroupsQuery } from '@/queries/students';
import type { AssignmentDTO } from '@dwengo-1/common/interfaces/assignment';
import type { GroupDTO } from '@dwengo-1/common/interfaces/group';
import DiscussionsSideBar from '@/components/DiscussionsSideBar.vue';

const route = useRoute();

const props = defineProps<{
    hruid: string;
    language: Language;
    learningObjectHruid?: string;
}>();

interface LearningPathPageQuery {
    forGroup?: string;
    assignmentNo?: string;
    classId?: string;
}

const query = computed(() => route.query as LearningPathPageQuery);

const forGroup = computed(() => {
    if (query.value.forGroup && query.value.assignmentNo && query.value.classId) {
        return {
            forGroup: parseInt(query.value.forGroup),
            assignmentNo: parseInt(query.value.assignmentNo),
            classId: query.value.classId,
        };
    }
    return undefined;
});

const allLearningPathsResult = useGetAllLearningPaths(props.language);

async function learningObjectHasQuestions(learningObject: LearningObject): Promise<boolean> {
    const loid = {
        hruid: learningObject.key,
        version: learningObject.version,
        language: learningObject.language,
    } as LearningObjectIdentifierDTO;
    const { data } = useQuestionsQuery(loid);
    return (data.value?.questions.length ?? 0) > 0;
}

async function learningPathHasQuestions(learningPath: LearningPath): Promise<boolean> {
    const learningPathQueryResult = useGetLearningPathQuery(learningPath.hruid, learningPath.language as Language, forGroup);
    const learningObjectListQueryResult = useLearningObjectListForPathQuery(learningPathQueryResult.data);
    const learningObjects = learningObjectListQueryResult.data.value || [];
    const hasQuestions = await Promise.all(
        learningObjects.map(async (learningObject) => learningObjectHasQuestions(learningObject)),
    );
    return hasQuestions.some((hasQuestion) => hasQuestion);
}

const questionedLearningPaths = ref<LearningPath[] | null>(null);

watch(
    () => allLearningPathsResult.data.value,
    async (learningPaths) => {
        if (learningPaths) {
            const pathsWithQuestions = await Promise.all(
                learningPaths.map(async (learningPath) => {
                    const hasQuestions = await learningPathHasQuestions(learningPath);
                    return hasQuestions ? learningPath : null;
                }),
            );
            questionedLearningPaths.value = pathsWithQuestions.filter((path) => path !== null);
        }
    },
    { immediate: true },
);

const learningPathQueryResult = useGetLearningPathQuery(props.hruid, props.language, forGroup);

const learningObjectListQueryResult = useLearningObjectListForPathQuery(learningPathQueryResult.data);

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

const studentAssignmentsQueryResult = useStudentAssignmentsQuery(
    authService.authState.user?.profile.preferred_username,
);
const pathIsAssignment = computed(() => {
    const assignments = (studentAssignmentsQueryResult.data.value?.assignments as AssignmentDTO[]) || [];
    return assignments.some(
        (assignment) => assignment.learningPath === props.hruid && assignment.language === props.language,
    );
});
const loID: ComputedRef<LearningObjectIdentifierDTO> = computed(() => ({
    hruid: props.learningObjectHruid as string,
    language: props.language,
    version: currentNode.value?.version,
}));

const createQuestionMutation = useCreateQuestionMutation(loID.value);

watch(
    () => [route.params.hruid, route.params.language, route.params.learningObjectHruid],
    () => {
        //TODO: moet op een of andere manier createQuestionMutation opnieuw kunnen instellen
        //      Momenteel opgelost door de DiscussionsForward page workaround
    },
);

const groupsQueryResult = useStudentGroupsQuery(authService.authState.user?.profile.preferred_username);

const questionInput = ref('');

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
    if (questionInput.value !== '') {
        createQuestionMutation.mutate(questionData, {
            onSuccess: async () => {
                questionInput.value = ''; // Clear the input field after submission
                await getQuestionsQuery.refetch(); // Reload the questions
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
    <DiscussionsSideBar></DiscussionsSideBar>

    <div
        v-if="authService.authState.activeRole === 'student' && pathIsAssignment"
        class="question-box"
    >
        <div class="input-wrapper">
            <input
                type="text"
                placeholder="question : ..."
                class="question-input"
                v-model="questionInput"
            />
            <button
                @click="submitQuestion"
                class="send-button"
            >
                ▶
            </button>
        </div>
    </div>
    <using-query-result
        :query-result="getQuestionsQuery"
        v-slot="questionsResponse: { data: QuestionsResponse }"
    >
        <QandA :questions="(questionsResponse.data.questions as QuestionDTO[]) ?? []" />
    </using-query-result>
</template>

<style scoped>
.learning-path-title {
    white-space: normal;
}

.search-field-container {
    min-width: 250px;
}

.control-bar-above-content {
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: -30px;
    display: flex;
    justify-content: space-between;
}

.learning-object-view-container {
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
}

.navigation-buttons-container {
    padding: 20px;
    display: flex;
    justify-content: space-between;
}

.assignment-indicator {
    position: absolute;
    bottom: 10px;
    left: 10px;
    padding: 4px 12px;
    border: 2px solid #f8bcbc;
    border-radius: 20px;
    color: #f36c6c;
    background-color: rgba(248, 188, 188, 0.1);
    font-weight: bold;
    font-family: Arial, sans-serif;
    font-size: 14px;
    text-transform: uppercase;
    z-index: 2; /* Less than modals/popups */
}

.question-box {
    width: 100%;
    max-width: 400px;
    margin: 20px auto;
    font-family: sans-serif;
}

.input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 999px;
    padding: 8px 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.question-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    background-color: transparent;
}

.question-input::placeholder {
    color: #999;
}

.send-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #555;
    transition: color 0.2s ease;
}

.send-button:hover {
    color: #000;
}

.discussion-link a {
    color: #3b82f6; /* blue */
    text-decoration: none;
}

.discussion-link a:hover {
    text-decoration: underline;
}
</style>
