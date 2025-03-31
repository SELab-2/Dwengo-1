<script setup lang="ts">
    import type {LearningPath} from "@/data-objects/learning-path.ts";
    import {useRoute, useRouter} from "vue-router";
    import {computed} from "vue";
    import {useI18n} from "vue-i18n";
    import {convertBase64ToImageSrc} from "@/utils/base64ToImage.ts";
    import LearningPathSearchField from "@/components/LearningPathSearchField.vue";
    import {useSearchLearningPathQuery} from "@/queries/learning-paths.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";

    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();

    const query = computed(() => route.query.query as string | null);

    const searchQueryResults = useSearchLearningPathQuery(query);
</script>

<template>
    <div class="search-field-container">
        <learning-path-search-field class="search-field"></learning-path-search-field>
    </div>

    <using-query-result :query-result="searchQueryResults" v-slot="{ data }: {data: LearningPath[]}">
        <div class="results-grid" v-if="data.length > 0">
            <v-card
                class="learning-path-card"
                link
                :to="`${learningPath.hruid}/${learningPath.language}/${learningPath.startNode.learningobjectHruid}`"
                v-for="learningPath in data"
            >
                <v-img
                    height="300px"
                    :src="convertBase64ToImageSrc(learningPath.image)"
                    cover
                    v-if="learningPath.image"
                ></v-img>
                <v-card-title>{{ learningPath.title }}</v-card-title>
                <v-card-subtitle>
                    <v-icon icon="mdi-human-male-boy"></v-icon>
                    <span>{{ learningPath.targetAges.min }} - {{ learningPath.targetAges.max }} {{ t('yearsAge') }}</span>
                </v-card-subtitle>
                <v-card-text>{{ learningPath.description }}</v-card-text>
            </v-card>
        </div>
        <div content="empty-state-container" v-else>
            <v-empty-state
                icon="mdi-emoticon-sad-outline"
                :title="t('noLearningPathsFound')"
                :text="t('noLearningPathsFoundDescription')"
            ></v-empty-state>
        </div>
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
    .results-grid {
        margin: 20px;
        display: flex;
        align-items: stretch;
        gap: 20px;
        flex-wrap: wrap;
    }
    .search-field {
        max-width: 300px;
    }
    .learning-path-card {
        width: 300px;
    }
</style>
