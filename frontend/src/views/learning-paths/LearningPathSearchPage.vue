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
    <div class="search-field-container">
        <learning-path-search-field class="search-field"></learning-path-search-field>
    </div>

    <using-query-result
        :query-result="searchQueryResults"
        v-slot="{ data }: { data: LearningPath[] }"
    >
        <learning-paths-grid :learning-paths="data"></learning-paths-grid>
    </using-query-result>
    <div content="empty-state-container">
        <v-empty-state
            v-if="!query"
            icon="mdi-magnify"
            :title="t('enterSearchTerm')"
            :text="t('enterSearchTermDescription')"
        ></v-empty-state>
    </div>
</template>

<style scoped>
    .search-field-container {
        display: block;
        margin: 20px;
    }
    .search-field {
        max-width: 300px;
    }
</style>
