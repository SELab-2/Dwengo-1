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

    function toggleDropdown(): void {
        dropdownEnabled.value = !dropdownEnabled.value;
    }
</script>

<template>
    <main>
        <div
            class="dropdown-toggle"
            @click="toggleDropdown()"
        >
            ▼{{ path.title }}
        </div>
        <div
            class="dropdown"
            v-if="dropdownEnabled"
        >
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
        </div>
    </main>
</template>

<style scoped>
    .dropdown {
        margin-left: 0.5rem;
        padding-left: 1rem;
        border-left: 2px solid #e0e0e0;
        background-color: #f9f9f9;
        border-radius: 4px;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }
    .dropdown-toggle {
        cursor: pointer;
        display: flex;
        align-items: center;
        font-weight: 600;
        user-select: none;
        padding: 0.5rem;
        transition: color 0.2s;
    }

    .dropdown-toggle:hover {
        color: #27c53f;
    }

    .dropdown-icon {
        margin-right: 0.5rem;
        font-size: 0.9rem;
    }
</style>
