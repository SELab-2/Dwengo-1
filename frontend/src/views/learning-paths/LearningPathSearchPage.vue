<script setup lang="ts">
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
    import { useRoute } from "vue-router";
    import { computed } from "vue";
    import { useI18n } from "vue-i18n";
    import LearningPathSearchField from "@/components/LearningPathSearchField.vue";
    import { useSearchLearningPathQuery } from "@/queries/learning-paths.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import LearningPathsGrid from "@/components/LearningPathsGrid.vue";

    const route = useRoute();
    const { t, locale } = useI18n();

    const query = computed(() => route.query.query as string | undefined);

    const searchQueryResults = useSearchLearningPathQuery(query, locale);
</script>

<template>
    <div class="search-page-container d-flex flex-column align-items-center justify-center">

        <div class = "search-field-container">
            <learning-path-search-field class="mx-auto"/>
        </div>

        <using-query-result
            :query-result="searchQueryResults"
            v-slot="{ data }: { data: LearningPath[] }"
        >
            <learning-paths-grid :learning-paths="data" />
        </using-query-result>

        <div
            v-if="!query"
            class="empty-state-container"
        >
            <v-empty-state
                icon="mdi-magnify"
                :title="t('enterSearchTerm')"
                :text="t('enterSearchTermDescription')"
            />
        </div>

    </div>
</template>

<style scoped>
    .search-page-container {
        padding-top: 40px;
        padding-bottom: 40px;
    }
    .search-field-container {
        justify-content: center !important;
    }
</style>
