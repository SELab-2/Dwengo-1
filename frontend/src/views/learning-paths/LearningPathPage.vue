<script setup lang="ts">
    import {Language} from "@/data-objects/language.ts";
    import {type LearningPath, LearningPathNode} from "@/data-objects/learning-path.ts";
    import {computed, type ComputedRef, ref, watch} from "vue";
    import type {LearningObject} from "@/data-objects/learning-object.ts";
    import {useRoute, useRouter} from "vue-router";
    import {type SuccessState} from "@/services/api-client/remote-resource.ts";
    import LearningObjectView from "@/views/learning-paths/LearningObjectView.vue";
    import {useI18n} from "vue-i18n";
    import LearningPathSearchField from "@/components/LearningPathSearchField.vue";
    import {useGetLearningPathQuery} from "@/queries/learning-paths.ts";
    import {useLearningObjectListForPathQuery} from "@/queries/learning-objects.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import authService from "@/services/auth/auth-service.ts";

    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();

    const props = defineProps<{hruid: string, language: Language, learningObjectHruid?: string}>()

    interface Personalization {
        forStudent?: string,
        forGroup?: string
    }

    const personalization = computed(() => {
        if (route.query.forStudent || route.query.forGroup) {
            return {
                forStudent: route.query.forStudent,
                forGroup: route.query.forGroup
            } as Personalization
        } else {
            return {
                forStudent: authService.authState.user?.profile?.preferred_username
            } as Personalization
        }
    });

    const learningPathQueryResult = useGetLearningPathQuery(
        props.hruid,
        props.language,
        personalization
    );

    const learningObjectListQueryResult = useLearningObjectListForPathQuery(learningPathQueryResult.data);

    const nodesList: ComputedRef<LearningPathNode[] | null> = computed(() =>
        learningPathQueryResult.isSuccess ? learningPathQueryResult.data.value?.nodesAsList : null
    );

    const currentNode = computed(() => {
        const currentHruid = props.learningObjectHruid;
        if (nodesList.value) {
            return nodesList.value.filter(it => it.learningobjectHruid === currentHruid)[0]
        }
    });

    const nextNode = computed(() => {
        if (!currentNode.value || !nodesList.value)
            return;
        const currentIndex = nodesList.value?.indexOf(currentNode.value);
        if (currentIndex < nodesList.value?.length) {
            return nodesList.value?.[currentIndex + 1];
        }
    });

    const previousNode = computed(() => {
        if (!currentNode.value || !nodesList.value)
            return;
        const currentIndex = nodesList.value?.indexOf(currentNode.value);
        if (currentIndex < nodesList.value?.length) {
            return nodesList.value?.[currentIndex - 1];
        }
    });

    watch(() => learningPathQueryResult, (newValue) => {
        if (learningPathQueryResult.isSuccess && false) {
            router.push({
                path: router.currentRoute.value.path + "/" + (newValue as SuccessState<LearningPath>).data.startNode.learningobjectHruid,
                query: route.query,
            });
        }
    });

    const navigationDrawerShown = ref(true);


    function isLearningObjectCompleted(learningObject: LearningObject): boolean {
        if (learningObjectListQueryResult.isSuccess) {
            return learningPathQueryResult.data.value.nodesAsList.filter(it =>
                it.learningobjectHruid === learningObject.key
                && it.version === learningObject.version
                && it.language == learningObject.language
            )[0].done;
        }
        return false;
    }

    type NavItemState = "teacherExclusive" | "completed" | "notCompleted";

    const ICONS: {[key: NavItemState]: string} = {
        teacherExclusive: "mdi-information",
        completed: "mdi-checkbox-marked-circle-outline",
        notCompleted: "mdi-checkbox-blank-circle-outline"
    }

    const COLORS: {[key: NavItemState]: string | undefined}  = {
        teacherExclusive: "info",
        completed: "success",
        notCompleted: undefined
    }

    function getNavItemState(learningObject: LearningObject): NavItemState {
        if (learningObject.teacherExclusive) {
            return "teacherExclusive";
        } else if (isLearningObjectCompleted(learningObject)) {
            return "completed";
        } else {
            return "notCompleted";
        }
    }
</script>

<template>
    <using-query-result
        :query-result="learningPathQueryResult"
        v-slot="learningPath: {data: LearningPath}"
    >
        <v-navigation-drawer v-model="navigationDrawerShown">
            <v-list-item
                :title="learningPath.data.title"
                :subtitle="learningPath.data.description"
            ></v-list-item>
            <v-list-item>
                <template v-slot:subtitle>
                    <p><v-icon :color="COLORS.notCompleted" :icon="ICONS.notCompleted"></v-icon> {{ t("legendNotCompletedYet") }}</p>
                    <p><v-icon :color="COLORS.completed" :icon="ICONS.completed"></v-icon> {{ t("legendCompleted") }}</p>
                    <p><v-icon :color="COLORS.teacherExclusive" :icon="ICONS.teacherExclusive"></v-icon> {{ t("legendTeacherExclusive") }}</p>
                </template>
            </v-list-item>
            <v-divider></v-divider>
            <div v-if="props.learningObjectHruid">
                <using-query-result
                    :query-result="learningObjectListQueryResult"
                    v-slot="learningObjects: {data: LearningObject[]}"
                >
                    <template v-for="node in learningObjects.data">
                        <v-list-item
                            link
                            :to="{path: node.key, query: route.query}"
                            :title="node.title"
                            :active="node.key === props.learningObjectHruid"
                            v-if="!node.teacherExclusive || authService.authState.activeRole === 'teacher'"
                        >
                            <template v-slot:prepend>
                                <v-icon
                                    :color="COLORS[getNavItemState(node)]"
                                    :icon="ICONS[getNavItemState(node)]"></v-icon>
                            </template>
                            <template v-slot:append>
                                {{ node.estimatedTime }}'
                            </template>
                        </v-list-item>
                    </template>
                </using-query-result>
            </div>
        </v-navigation-drawer>
        <div class="control-bar-above-content">
            <v-btn
                :icon="navigationDrawerShown ? 'mdi-menu-open' : 'mdi-menu'"
                class="navigation-drawer-toggle-button"
                variant="plain"
                @click="navigationDrawerShown = !navigationDrawerShown"></v-btn>
            <div class="search-field-container">
                <learning-path-search-field></learning-path-search-field>
            </div>
        </div>
        <learning-object-view
            :hruid="currentNode.learningobjectHruid"
            :language="currentNode.language"
            :version="currentNode.version"
            v-if="currentNode"
        ></learning-object-view>
        <div class="navigation-buttons-container">
            <v-btn
                prepend-icon="mdi-chevron-left"
                variant="text"
                :disabled="!previousNode"
                :to="previousNode ? {path: previousNode.learningobjectHruid, query: route.query} : undefined"
            >
                {{ t("previous") }}
            </v-btn>
            <v-btn
                append-icon="mdi-chevron-right"
                variant="text"
                :disabled="!nextNode"
                :to="nextNode ? {path: nextNode.learningobjectHruid, query: route.query} : undefined"
            >
                {{ t("next") }}
            </v-btn>
        </div>
    </using-query-result>
</template>

<style scoped>
    .search-field-container {
        min-width: 250px;
    }
    .control-bar-above-content {
        margin-left: 5px;
        margin-right: 5px;
        margin-bottom: -30px;
        display: flex;
        justify-content: space-between;
    }
    .navigation-buttons-container {
        padding: 20px;
        display: flex;
        justify-content: space-between;
    }
</style>
