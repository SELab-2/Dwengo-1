<script setup lang="ts">
    import type { LearningObject } from "@/data-objects/learning-objects/learning-object";
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path";
    import { useLearningObjectListForPathQuery } from "@/queries/learning-objects";
    import { useRoute } from "vue-router";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import QuestionNotification from "@/components/QuestionNotification.vue";

    const route = useRoute();

    const props = defineProps<{
        path: LearningPath;
        activeObjectId: string;
    }>();

    const learningObjects = useLearningObjectListForPathQuery(props.path);
</script>

<template>
    <using-query-result
        :query-result="learningObjects"
        v-slot="learningObjects: { data: LearningObject[] }"
    >
        <template
            v-for="node in learningObjects.data"
            :key="node.key"
        >
            <v-list-item
                link
                :to="{
                    path: `/discussion-reload/${props.path.hruid}/${node.language}/${node.key}`,
                    query: route.query,
                }"
                :title="node.title"
                :active="node.key === props.activeObjectId"
            >
                <template v-slot:append>
                    <QuestionNotification :node="node"></QuestionNotification>
                </template>
            </v-list-item>
        </template>
    </using-query-result>
</template>

<style scoped></style>
