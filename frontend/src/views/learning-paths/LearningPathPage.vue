<script setup lang="ts">
    import { Language } from "@/data-objects/language.ts";
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
    import { computed, type ComputedRef, ref } from "vue";
    import type { LearningObject } from "@/data-objects/learning-objects/learning-object.ts";
    import { useRoute } from "vue-router";
    import LearningObjectView from "@/views/learning-paths/LearningObjectView.vue";
    import { useI18n } from "vue-i18n";
    import LearningPathSearchField from "@/components/LearningPathSearchField.vue";
    import { useGetLearningPathQuery } from "@/queries/learning-paths.ts";
    import { useLearningObjectListForPathQuery } from "@/queries/learning-objects.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import authService from "@/services/auth/auth-service.ts";
    import { LearningPathNode } from "@/data-objects/learning-paths/learning-path-node.ts";
import { useStudentAssignmentsQuery } from "@/queries/students";
import type { AssignmentDTO } from "@dwengo-1/common/interfaces/assignment";
import { watch } from "vue";

    const route = useRoute();
    const { t } = useI18n();

    const props = defineProps<{ hruid: string; language: Language; learningObjectHruid?: string }>();

    interface Personalization {
        forStudent?: string;
        forGroup?: string;
    }

    const personalization = computed(() => {
        if (route.query.forStudent || route.query.forGroup) {
            return {
                forStudent: route.query.forStudent,
                forGroup: route.query.forGroup,
            } as Personalization;
        }
        return {
            forStudent: authService.authState.user?.profile?.preferred_username,
        } as Personalization;
    });

    const learningPathQueryResult = useGetLearningPathQuery(props.hruid, props.language, personalization);

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

    //TODO: berekenen of het een assignment is voor de student werkt nog niet zoals het hoort...

    const studentAssignmentsQuery = useStudentAssignmentsQuery(authService.authState.user?.profile?.preferred_username);

    watch(
        () => authService.authState.user?.profile?.preferred_username,
        (newUsername) => {
            if (newUsername) {
                studentAssignmentsQuery.refetch();
            }
        }
    );

    const isAssignmentForStudent = computed(() => {
        // Check if the user is a student
        const isStudent = authService.authState.activeRole === "student";

        if (isStudent && studentAssignmentsQuery.isSuccess) {
            // Use the query to fetch assignments for the current student
            console.log("Query Result:", studentAssignmentsQuery.data?.value);

            // Check if the query is successful and contains the current learning path
            const isAssignment = (studentAssignmentsQuery.data?.value?.assignments as AssignmentDTO[]).some(
                (assignment: AssignmentDTO) => {
                    console.log(assignment.learningPath)
                    return assignment.learningPath === props.hruid
                }
            );

            // Return true only if the user is a student and the learning path is an assignment
            return isAssignment;
        }

        return false;
    });

    function submitQuestion() {
      // Replace with actual submission logic
      alert(`Submitted`);
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
            <v-divider></v-divider>
            <div v-if="true" class="assignment-indicator">  
                ASSIGNMENT
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
        <learning-object-view
            :hruid="currentNode.learningobjectHruid"
            :language="currentNode.language"
            :version="currentNode.version"
            v-if="currentNode"
        ></learning-object-view>
        <div class="question-box">
            <div class="input-wrapper">
              <input
                type="text"
                placeholder="question : ..."
                class="question-input"
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
