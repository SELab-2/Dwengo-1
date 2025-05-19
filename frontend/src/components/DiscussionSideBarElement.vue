<script setup lang="ts">
    import type { LearningObject } from "@/data-objects/learning-objects/learning-object";
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path";
    import { useLearningObjectListForPathQuery } from "@/queries/learning-objects";
    import { useRoute } from "vue-router";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { ref, watchEffect } from "vue";

    const route = useRoute();

    const props = defineProps<{
        path: LearningPath;
        activeObjectId: string;
    }>();

    const currentPath = ref(props.path);

    const learningObjectListQueryResult = useLearningObjectListForPathQuery(currentPath);

    const dropdownEnabled = ref<boolean>(false);

    watchEffect(() => {
        const objects = learningObjectListQueryResult.data.value;

        if (objects) {
            const objectInThisPath = objects.some((obj) => obj.key === props.activeObjectId);
            if (objectInThisPath) {
                dropdownEnabled.value = true;
            }
        }
    });
</script>

<template>
    <v-expansion-panel>
        <v-expansion-panel-title>
            {{ path.title }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
            <using-query-result
                :query-result="learningObjectListQueryResult"
                v-slot="learningObjects: { data: LearningObject[] }"
            >
                <template
                    v-for="node in learningObjects.data"
                    :key="node.key"
                >
                    <v-list-item
                        link
                        :to="{
                            path: `/discussion-reload/${currentPath.hruid}/${node.language}/${node.key}`,
                            query: route.query,
                        }"
                        :title="node.title"
                        :active="node.key === props.activeObjectId"
                    >
                    </v-list-item>
                </template>
            </using-query-result>
        </v-expansion-panel-text>
    </v-expansion-panel>
</template>

<style scoped>
</style>
