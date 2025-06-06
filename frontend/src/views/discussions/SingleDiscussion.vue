<script setup lang="ts">
    import { Language } from "@/data-objects/language.ts";
    import { computed, type ComputedRef, watch } from "vue";
    import { useRoute } from "vue-router";
    import { useGetLearningPathQuery } from "@/queries/learning-paths.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { LearningPathNode } from "@/data-objects/learning-paths/learning-path-node.ts";
    import { useQuestionsQuery } from "@/queries/questions";
    import type { QuestionsResponse } from "@/controllers/questions";
    import type { LearningObjectIdentifierDTO } from "@dwengo-1/common/interfaces/learning-content";
    import QandA from "@/components/QandA.vue";
    import type { QuestionDTO } from "@dwengo-1/common/interfaces/question";
    import DiscussionsSideBar from "@/components/DiscussionsSideBar.vue";
    import QuestionBox from "@/components/QuestionBox.vue";
    import { useI18n } from "vue-i18n";

    const { t } = useI18n();

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

    const learningPathQueryResult = useGetLearningPathQuery(props.hruid, props.language, forGroup);

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

    watch(
        () => [route.params.hruid, route.params.language, route.params.learningObjectHruid],
        () => {
            //TODO: moet op een of andere manier createQuestionMutation opnieuw kunnen instellen
            //      Momenteel opgelost door de DiscussionsForward page workaround
        },
    );
</script>

<template>
    <DiscussionsSideBar :learningObjectHruid="props.learningObjectHruid"> </DiscussionsSideBar>
    <div class="discussions-container">
        <QuestionBox
            :hruid="props.hruid"
            :language="props.language"
            :learningObjectHruid="props.learningObjectHruid"
            :forGroup="forGroup"
            withTitle
        />
        <h3>{{ t("questionsCapitalized") }}:</h3>
        <using-query-result
            :query-result="getQuestionsQuery"
            v-slot="questionsResponse: { data: QuestionsResponse }"
        >
            <QandA :questions="(questionsResponse.data.questions as QuestionDTO[]) ?? []" />
        </using-query-result>
    </div>
</template>

<style scoped>
    .discussions-container {
        margin: 20px;
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

    .discussion-link a {
        color: #3b82f6; /* blue */
        text-decoration: none;
    }

    .discussion-link a:hover {
        text-decoration: underline;
    }
</style>
