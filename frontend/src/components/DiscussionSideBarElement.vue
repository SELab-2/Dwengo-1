<script setup lang="ts">
import type { LearningObject } from '@/data-objects/learning-objects/learning-object';
import type { LearningPath } from '@/data-objects/learning-paths/learning-path';
import { useLearningObjectListForPathQuery } from '@/queries/learning-objects';
import { useRoute } from 'vue-router';
import UsingQueryResult from "@/components/UsingQueryResult.vue";

    const route = useRoute();

    const props = defineProps<{
        path: LearningPath;
        activeObjectId: string 
    }>();

    const learningObjectListQueryResult = useLearningObjectListForPathQuery(props.path);

    console.log(learningObjectListQueryResult.data.value)

</script>

<template>
    <main>
        <div>{{path.title}}</div>
        <template>
            <using-query-result
                :query-result="learningObjectListQueryResult"
                v-slot="learningObjects: { data: LearningObject[] }"
            >
                <template v-for="node in learningObjects.data">
                    <v-list-item
                        link
                        :to="{ path: node.key, query: route.query }"
                        :title="node.title"
                        :active="node.key === props.activeObjectId"
                    >
                    </v-list-item>
                </template>
            </using-query-result>
        </template>
    </main>
</template>

<style scoped></style>
