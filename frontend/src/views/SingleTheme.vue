<script setup lang="ts">
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
    import LearningPathsGrid from "@/components/LearningPathsGrid.vue";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { useGetAllLearningPathsByThemeAndLanguageQuery } from "@/queries/learning-paths.ts";
    import { computed, ref } from "vue";
    import { useI18n } from "vue-i18n";
    import { useThemeQuery } from "@/queries/themes.ts";
    import type { Language } from "@/data-objects/language";

    const props = defineProps<{ theme: string }>();

    const { locale } = useI18n();
    const language = computed(() => locale.value);

    const themeQueryResult = useThemeQuery(language);

    const currentThemeInfo = computed(() => themeQueryResult.data.value?.find((it) => it.key === props.theme));

    const learningPathsForThemeQueryResult = useGetAllLearningPathsByThemeAndLanguageQuery(
        () => props.theme,
        () => locale.value as Language,
    );

    const { t } = useI18n();
    const searchFilter = ref("");

    function filterLearningPaths(learningPaths: LearningPath[]): LearningPath[] {
        return learningPaths.filter(
            (it) =>
                it.title.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
                it.description.toLowerCase().includes(searchFilter.value.toLowerCase()),
        );
    }
</script>

<template>
    <div class="container d-flex flex-column align-items-center justify-center">
        <using-query-result :query-result="themeQueryResult">
            <h1>{{ currentThemeInfo!!.title }}</h1>
            <p>{{ currentThemeInfo!!.description }}</p>
            <br />
            <div class="search-field-container mt-sm-6">
                <v-text-field
                    class="search-field mx-auto"
                    :label="t('search')"
                    append-inner-icon="mdi-magnify"
                    v-model="searchFilter"
                ></v-text-field>
            </div>

            <using-query-result
                :query-result="learningPathsForThemeQueryResult"
                v-slot="{ data }: { data: LearningPath[] }"
            >
                <learning-paths-grid :learning-paths="filterLearningPaths(data)"></learning-paths-grid>
            </using-query-result>
        </using-query-result>
    </div>
</template>

<style scoped>
    .search-field-container {
        justify-content: center !important;
    }
    .search-field {
        width: 25%;
        min-width: 300px;
    }
    .container {
        padding: 20px;
        justify-content: center;
        justify-items: center;
    }
</style>
