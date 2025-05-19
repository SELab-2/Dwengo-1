<script setup lang="ts">
    import type { LearningObject } from '@/data-objects/learning-objects/learning-object';
    import type { LearningPath } from '@/data-objects/learning-paths/learning-path';
    import { useLearningObjectListForPathQuery } from '@/queries/learning-objects';
    import { useRoute } from 'vue-router';
    import UsingQueryResult from '@/components/UsingQueryResult.vue';
    import QuestionNotification from "@/components/QuestionNotification.vue";

    const route = useRoute();

    const props = defineProps<{
        path: LearningPath;
        activeObjectId: string;
    }>();
</script>

<template>
    <v-expansion-panel :value="props.path.hruid">
        <v-expansion-panel-title>
            {{ path.title }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
            <v-lazy>
                <using-query-result
                    :query-result="useLearningObjectListForPathQuery(props.path)"
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
            </v-lazy>
        </v-expansion-panel-text>
    </v-expansion-panel>
</template>

<style scoped></style>
