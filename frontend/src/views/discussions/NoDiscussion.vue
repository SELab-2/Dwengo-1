<script setup lang="ts">
    import { Language } from "@/data-objects/language.ts";
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
    import { computed, type ComputedRef, provide, ref, watch } from "vue";
    import type { LearningObject } from "@/data-objects/learning-objects/learning-object.ts";
    import { useRoute, useRouter } from "vue-router";
    import LearningObjectView from "@/views/learning-paths/learning-object/LearningObjectView.vue";
    import { useI18n } from "vue-i18n";
    import LearningPathSearchField from "@/components/LearningPathSearchField.vue";
    import { useGetAllLearningPaths, useGetLearningPathQuery } from "@/queries/learning-paths.ts";
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
    import { useStudentAssignmentsQuery, useStudentGroupsQuery } from "@/queries/students";
    import type { AssignmentDTO } from "@dwengo-1/common/interfaces/assignment";
    import type { GroupDTO } from "@dwengo-1/common/interfaces/group";
    import DiscussionSideBarElement from "@/components/DiscussionSideBarElement.vue";

    const route = useRoute();
    const { t, locale } = useI18n();

    const allLearningPathsResult = useGetAllLearningPaths(locale.value)

</script>

<template>
    <div class="d-flex flex-column h-100">
        <v-list-item>
            <template v-slot:title>
                <div class="title">Discussions</div>
            </template>
        </v-list-item>
        <v-divider></v-divider>
        <div>
            <using-query-result
                :query-result="allLearningPathsResult"
                v-slot="learningPaths: {data: LearningPath[]}">
                <DiscussionSideBarElement
                    v-for="learningPath in learningPaths.data"
                    :path="learningPath"
                    :activeObjectId="'' as string">
                </DiscussionSideBarElement>
            </using-query-result>
        </div>
    </div>
</template>

<style scoped>
    .title {
        color: #0e6942;
        text-transform: uppercase;
        font-weight: bolder;
        padding-top: 2%;
        font-size: 50px;
    }
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
