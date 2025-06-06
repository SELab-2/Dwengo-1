<script setup lang="ts">
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import DiscussionSideBarElement from "@/components/DiscussionSideBarElement.vue";
    import { useI18n } from "vue-i18n";
    import { useGetAllLearningPaths } from "@/queries/learning-paths.ts";
    import { ref, watch } from "vue";
    import { useRoute } from "vue-router";

    const { t, locale } = useI18n();
    const route = useRoute();

    const props = defineProps<{
        learningObjectHruid: string;
    }>();

    const navigationDrawerShown = ref(true);
    const currentLocale = ref(locale.value);
    const expanded = ref([route.params.hruid]);

    watch(locale, (newLocale) => {
        currentLocale.value = newLocale;
    });

    const allLearningPathsResult = useGetAllLearningPaths(() => currentLocale.value);
</script>

<template>
    <v-navigation-drawer
        v-model="navigationDrawerShown"
        :width="350"
        app
    >
        <div class="d-flex flex-column h-100">
            <v-list-item>
                <template v-slot:title>
                    <div class="title">{{ t("discussions") }}</div>
                </template>
            </v-list-item>
            <v-divider></v-divider>
            <div class="nav-scroll-area">
                <v-expansion-panels v-model="expanded">
                    <using-query-result
                        :query-result="allLearningPathsResult"
                        v-slot="learningPaths: { data: LearningPath[] }"
                    >
                        <v-expansion-panel
                            v-for="learningPath in learningPaths.data"
                            :key="learningPath.hruid"
                            :value="learningPath.hruid"
                        >
                            <v-expansion-panel-title>
                                {{ learningPath.title }}
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-lazy>
                                    <DiscussionSideBarElement
                                        :path="learningPath"
                                        :activeObjectId="props.learningObjectHruid"
                                    />
                                </v-lazy>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </using-query-result>
                </v-expansion-panels>
            </div>
        </div>
    </v-navigation-drawer>
    <div class="control-bar-above-content">
        <v-btn
            :icon="navigationDrawerShown ? 'mdi-menu-open' : 'mdi-menu'"
            class="navigation-drawer-toggle-button"
            variant="plain"
            @click="navigationDrawerShown = !navigationDrawerShown"
        ></v-btn>
    </div>
</template>

<style scoped>
    .title {
        color: #0e6942;
        text-transform: uppercase;
        font-weight: bolder;
        padding-top: 2%;
        font-size: 36px;
    }

    .nav-scroll-area {
        overflow-y: auto;
        flex-grow: 1;
        min-height: 0;
    }
</style>
