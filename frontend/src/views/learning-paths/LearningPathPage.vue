<script setup lang="ts">
    import { Language } from "@/data-objects/language.ts";
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
    import { computed, type ComputedRef, ref } from "vue";
    import type { LearningObject } from "@/data-objects/learning-objects/learning-object.ts";
    import { useRoute, useRouter } from "vue-router";
    import LearningObjectView from "@/views/learning-paths/learning-object/LearningObjectView.vue";
    import { useI18n } from "vue-i18n";
    import LearningPathSearchField from "@/components/LearningPathSearchField.vue";
    import { useGetLearningPathQuery } from "@/queries/learning-paths.ts";
    import { useLearningObjectListForPathQuery } from "@/queries/learning-objects.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import authService from "@/services/auth/auth-service.ts";
    import { LearningPathNode } from "@/data-objects/learning-paths/learning-path-node.ts";
    import LearningPathGroupSelector from "@/views/learning-paths/LearningPathGroupSelector.vue";
    import { useCreateQuestionMutation, useQuestionsQuery } from "@/queries/questions";
    import type { QuestionsResponse } from "@/controllers/questions";
    import type { LearningObjectIdentifierDTO } from "@dwengo-1/common/interfaces/learning-content";
    import QandA from "@/components/QandA.vue";
    import type { QuestionData, QuestionDTO } from "@dwengo-1/common/interfaces/question";
    import {useStudentAssignmentsQuery, useStudentGroupsQuery} from "@/queries/students"
    import type { AssignmentDTO } from "@dwengo-1/common/interfaces/assignment";
import type { GroupDTO } from "@dwengo-1/common/interfaces/group";

    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();

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

    const learningPathQueryResult = useGetLearningPathQuery(props.hruid, props.language, forGroup);

    const learningObjectListQueryResult = useLearningObjectListForPathQuery(learningPathQueryResult.data);

    const nodesList: ComputedRef<LearningPathNode[] | null> = computed(
        () => learningPathQueryResult.data.value?.nodesAsList ?? null,
    );

    const currentNode = computed(() => {
        const currentHruid = props.learningObjectHruid;
        return nodesList.value?.find((it) => it.learningobjectHruid === currentHruid);
    });

    const nextNode = computed(() => {
        if (!currentNode.value || !nodesList.value) return undefined;
        const currentIndex = nodesList.value?.indexOf(currentNode.value);
        return currentIndex < nodesList.value?.length ? nodesList.value?.[currentIndex + 1] : undefined;
    });

    const previousNode = computed(() => {
        if (!currentNode.value || !nodesList.value) return undefined;
        const currentIndex = nodesList.value?.indexOf(currentNode.value);
        return currentIndex < nodesList.value?.length ? nodesList.value?.[currentIndex - 1] : undefined;
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

    const navigationDrawerShown = ref(true);

    function isLearningObjectCompleted(learningObject: LearningObject): boolean {
        if (learningObjectListQueryResult.isSuccess) {
            return (
                learningPathQueryResult.data.value?.nodesAsList?.find(
                    (it) =>
                        it.learningobjectHruid === learningObject.key &&
                        it.version === learningObject.version &&
                        it.language === learningObject.language,
                )?.done ?? false
            );
        }
        return false;
    }

    type NavItemState = "teacherExclusive" | "completed" | "notCompleted";

    const ICONS: Record<NavItemState, string> = {
        teacherExclusive: "mdi-information",
        completed: "mdi-checkbox-marked-circle-outline",
        notCompleted: "mdi-checkbox-blank-circle-outline",
    };

    const COLORS: Record<NavItemState, string | undefined> = {
        teacherExclusive: "info",
        completed: "success",
        notCompleted: undefined,
    };

    function getNavItemState(learningObject: LearningObject): NavItemState {
        if (learningObject.teacherExclusive) {
            return "teacherExclusive";
        } else if (isLearningObjectCompleted(learningObject)) {
            return "completed";
        }
        return "notCompleted";
    }

    const forGroupQueryParam = computed<number | undefined>({
        get: () => route.query.forGroup,
        set: async (value: number | undefined) => {
            const query = structuredClone(route.query);
            query.forGroup = value;
            await router.push({ query });
        },
    });

    async function assign(): Promise<void> {
        await router.push({
            path: "/assignment/create",
            query: {
                hruid: props.hruid,
                language: props.language,
            },
        });
    }

    const studentAssignmentsQueryResult = useStudentAssignmentsQuery(authService.authState.user?.profile.preferred_username);
    const pathIsAssignment = computed(() => {
        const assignments = studentAssignmentsQueryResult.data.value?.assignments as AssignmentDTO[] || [];
        return assignments.some(
            (assignment) =>
                assignment.learningPath === props.hruid &&
                assignment.language === props.language
        );
    });

    const loID:LearningObjectIdentifierDTO = {
            hruid: props.learningObjectHruid as string,
            language: props.language
        }
    const createQuestionMutation = useCreateQuestionMutation(loID)
    const groupsQueryResult = useStudentGroupsQuery(authService.authState.user?.profile.preferred_username)

    const questionInput = ref("");

    function submitQuestion() {
        const assignments = studentAssignmentsQueryResult.data.value?.assignments as AssignmentDTO[]
        const assignment = assignments.find(
            (assignment) =>
                assignment.learningPath === props.hruid &&
                assignment.language === props.language
        )
        const groups = groupsQueryResult.data.value?.groups as GroupDTO[]
        const group = groups?.find(group => group.assignment === assignment?.id) as GroupDTO
        const questionData:QuestionData = {
            author: authService.authState.user?.profile.preferred_username,
            content: questionInput.value,
            inGroup: group //TODO: POST response zegt dat dit null is???
        }
        console.log(questionData)
        if (questionInput.value != "") {
            createQuestionMutation.mutate(questionData, {
                onSuccess: () => {
                    questionInput.value = ""; // Clear the input field after submission
                },
                onError: (e) => {
                    console.error(e)
                },
            })
        } else {
            alert("Please type a question before submitting.") // TODO: i18n
        }
        
    }

</script>

<template>
    <using-query-result
        :query-result="learningPathQueryResult"
        v-slot="learningPath: { data: LearningPath }"
    >
        <v-navigation-drawer
            v-model="navigationDrawerShown"
            :width="350"
        >
            <div class="d-flex flex-column h-100">
                <v-list-item>
                    <template v-slot:title>
                        <div class="learning-path-title">{{ learningPath.data.title }}</div>
                    </template>
                    <template v-slot:subtitle>
                        <div>{{ learningPath.data.description }}</div>
                    </template>
                </v-list-item>
                <v-list-item>
                    <template v-slot:subtitle>
                        <p>
                            <v-icon
                                :color="COLORS.notCompleted"
                                :icon="ICONS.notCompleted"
                            ></v-icon>
                            {{ t("legendNotCompletedYet") }}
                        </p>
                        <p>
                            <v-icon
                                :color="COLORS.completed"
                                :icon="ICONS.completed"
                            ></v-icon>
                            {{ t("legendCompleted") }}
                        </p>
                        <p>
                            <v-icon
                                :color="COLORS.teacherExclusive"
                                :icon="ICONS.teacherExclusive"
                            ></v-icon>
                            {{ t("legendTeacherExclusive") }}
                        </p>
                    </template>
                </v-list-item>
                <v-list-item
                    v-if="query.classId && query.assignmentNo && authService.authState.activeRole === 'teacher'"
                >
                    <template v-slot:default>
                        <learning-path-group-selector
                            :class-id="query.classId"
                            :assignment-number="parseInt(query.assignmentNo)"
                            v-model="forGroupQueryParam"
                        />
                    </template>
                </v-list-item>
                <v-divider></v-divider>
                <div v-if="props.learningObjectHruid">
                    <using-query-result
                        :query-result="learningObjectListQueryResult"
                        v-slot="learningObjects: { data: LearningObject[] }"
                    >
                        <template v-for="node in learningObjects.data">
                            <v-list-item
                                link
                                :to="{ path: node.key, query: route.query }"
                                :title="node.title"
                                :active="node.key === props.learningObjectHruid"
                                :key="node.key"
                                v-if="!node.teacherExclusive || authService.authState.activeRole === 'teacher'"
                            >
                                <template v-slot:prepend>
                                    <v-icon
                                        :color="COLORS[getNavItemState(node)]"
                                        :icon="ICONS[getNavItemState(node)]"
                                    ></v-icon>
                                </template>
                                <template v-slot:append> {{ node.estimatedTime }}' </template>
                            </v-list-item>
                        </template>
                    </using-query-result>
                </div>
                <v-spacer></v-spacer>
                <v-list-item v-if="authService.authState.activeRole === 'teacher'">
                    <template v-slot:default>
                        <v-btn
                            class="button-in-nav"
                            @click="assign()"
                            >{{ t("assignLearningPath") }}</v-btn
                        >
                    </template>
                </v-list-item>
                <v-list-item>
                    <div v-if="(authService.authState.activeRole === 'student') && (pathIsAssignment)" class="assignment-indicator">  
                        {{ t("assignmentIndicator") }}
                    </div>
                </v-list-item>
            </div>
        </v-navigation-drawer>
        <div class="control-bar-above-content">
            <v-btn
                :icon="navigationDrawerShown ? 'mdi-menu-open' : 'mdi-menu'"
                class="navigation-drawer-toggle-button"
                variant="plain"
                @click="navigationDrawerShown = !navigationDrawerShown"
            ></v-btn>
            <div class="search-field-container">
                <learning-path-search-field></learning-path-search-field>
            </div>
        </div>
        <div class="learning-object-view-container">
            <learning-object-view
                :hruid="currentNode.learningobjectHruid"
                :language="currentNode.language"
                :version="currentNode.version"
                :group="forGroup"
                v-if="currentNode"
            ></learning-object-view>
        </div>
        <div v-if="authService.authState.activeRole === 'student'" class="question-box">
            <div class="input-wrapper">
              <input
                type="text"
                placeholder="question : ..."
                class="question-input"
                v-model="questionInput"
              />
              <button @click="submitQuestion" class="send-button">▶</button>
            </div>
            <div class="discussion-link">
              <span>view answers in </span>
              <a href="/discussions/">discussions</a>.
            </div>
          </div>
        <div class="navigation-buttons-container">
            <v-btn
                prepend-icon="mdi-chevron-left"
                variant="text"
                :disabled="!previousNode"
                :to="previousNode ? { path: previousNode.learningobjectHruid, query: route.query } : undefined"
            >
                {{ t("previous") }}
            </v-btn>
            <v-btn
                append-icon="mdi-chevron-right"
                variant="text"
                :disabled="!nextNode"
                :to="nextNode ? { path: nextNode.learningobjectHruid, query: route.query } : undefined"
            >
                {{ t("next") }}
            </v-btn>
        </div>
        <using-query-result
            :query-result="getQuestionsQuery"
            v-slot="questionsResponse: { data: QuestionsResponse }"
        >
            <QandA :questions="questionsResponse.data.questions as QuestionDTO[] ?? []" />
        </using-query-result>
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
      
      .discussion-link {
        margin-top: 8px;
        font-size: 13px;
        color: #444;
      }
      
      .discussion-link a {
        color: #3b82f6; /* blue */
        text-decoration: none;
      }
      
      .discussion-link a:hover {
        text-decoration: underline;
      }
</style>
