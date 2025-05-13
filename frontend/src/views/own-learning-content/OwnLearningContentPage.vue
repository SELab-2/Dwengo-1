<script setup lang="ts">
    import {useLearningObjectListForAdminQuery} from "@/queries/learning-objects.ts";
    import OwnLearningObjectsView from "@/views/own-learning-content/learning-objects/OwnLearningObjectsView.vue"
    import OwnLearningPathsView from "@/views/own-learning-content/learning-paths/OwnLearningPathsView.vue"
    import authService from "@/services/auth/auth-service.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import type { LearningObject } from "@/data-objects/learning-objects/learning-object";
    import { ref, type Ref } from "vue";
    import { useI18n } from "vue-i18n";
    import { useGetAllLearningPathsByAdminQuery } from "@/queries/learning-paths";
    import type { LearningPath as LearningPathDTO } from "@dwengo-1/common/interfaces/learning-content";

    const { t } = useI18n();

    const learningObjectsQuery =
        useLearningObjectListForAdminQuery(authService.authState.user?.profile.preferred_username);

    const learningPathsQuery =
        useGetAllLearningPathsByAdminQuery(authService.authState.user?.profile.preferred_username);

    type Tab = "learningObjects" | "learningPaths";
    const tab: Ref<Tab> = ref("learningObjects");
</script>

<template>
    <div class="tab-pane-container">
        <v-tabs v-model="tab">
        <v-tab value="learningObjects">{{ t('learningObjects') }}</v-tab>
        <v-tab value="learningPaths">{{ t('learningPaths') }}</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="main-content">
            <v-tabs-window-item value="learningObjects" class="main-content">
                <using-query-result
                    :query-result="learningObjectsQuery"
                    v-slot="response: { data: LearningObject[] }"
                >
                    <own-learning-objects-view :learningObjects="response.data"></own-learning-objects-view>
                </using-query-result>
            </v-tabs-window-item>
            <v-tabs-window-item value="learningPaths">
                <using-query-result
                    :query-result="learningPathsQuery"
                    v-slot="response: { data: LearningPathDTO[] }"
                >
                    <own-learning-paths-view :learningPaths="response.data"/>
                </using-query-result>
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
</template>

<style scoped>
    .tab-pane-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 20px 30px;
    }
    .main-content {
        flex: 1 1;
        height: 100%;
    }
</style>
