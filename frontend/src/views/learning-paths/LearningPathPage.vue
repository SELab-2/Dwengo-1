<script setup lang="ts">
    import {Language} from "@/services/learning-content/language.ts";
    import {getLearningPath} from "@/services/learning-content/learning-path-service.ts";
    import UsingRemoteResource from "@/components/UsingRemoteResource.vue";
    import {type LearningPath, LearningPathNode} from "@/services/learning-content/learning-path.ts";
    import {computed, type ComputedRef, ref, watch} from "vue";
    import type {LearningObject} from "@/services/learning-content/learning-object.ts";
    import {useRoute, useRouter} from "vue-router";
    import {loadResource, remoteResource, type SuccessState} from "@/services/api-client/remote-resource.ts";
    import LearningObjectView from "@/views/learning-paths/LearningObjectView.vue";
    import {useI18n} from "vue-i18n";

    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();

    const props = defineProps<{hruid: string, language: Language, learningObjectHruid?: string}>()

    interface QueryParams {
        forStudent?: string,
        forGroup?: string
    }

    const learningPathResource = remoteResource<LearningPath>();
    watch([() => props.hruid, () => props.language, () => route.query.forStudent, () => route.query.forGroup], () => {
        loadResource(
            learningPathResource,
            getLearningPath(
                props.hruid,
                props.language,
                route.query as QueryParams
            )
        )
    }, {immediate: true});

    const learningObjectListResource = remoteResource<LearningObject[]>();
    watch(learningPathResource, () => {
        if (learningPathResource.state.type === "success") {
            loadResource(learningObjectListResource, learningPathResource.state.data.learningObjectsAsList)
        }
    }, {immediate: true});

    const nodesList: ComputedRef<LearningPathNode[] | null> = computed(() => {
        if (learningPathResource.state.type === "success") {
            return learningPathResource.state.data.nodesAsList;
        } else {
            return null;
        }
    })

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

    watch(() => learningPathResource.state, (newValue) => {
        if (!props.learningObjectHruid && newValue.type === "success") {
            router.push({
                path: router.currentRoute.value.path + "/" + (newValue as SuccessState<LearningPath>).data.startNode.learningobjectHruid,
                query: route.query,
            });
        }
    });

    const navigationDrawerShown = ref(true);

    function isLearningObjectCompleted(learningObject: LearningObject): boolean {
        if (learningPathResource.state.type === "success") {
            return learningPathResource.state.data.nodesAsList.filter(it =>
                it.learningobjectHruid === learningObject.key
                && it.version === learningObject.version
                && it.language == learningObject.language
            )[0].done;
        }
        return false;
    }
</script>

<template>
    <using-remote-resource
        :resource="learningPathResource"
        v-slot="learningPath: {data: LearningPath}"
    >
        <v-navigation-drawer v-model="navigationDrawerShown">
            <v-list-item
                :title="learningPath.data.title"
                :subtitle="learningPath.data.description"
            ></v-list-item>
            <v-divider></v-divider>

            <div v-if="props.learningObjectHruid">
                <using-remote-resource
                    :resource="learningObjectListResource"
                    v-slot="learningObjects: {data: LearningObject[]}"
                >
                    <v-list-item
                        link
                        :to="{path: node.key, query: route.query}"
                        :title="node.title"
                        :active="node.key === props.learningObjectHruid"
                        :prepend-icon="isLearningObjectCompleted(node) ? 'mdi-checkbox-marked-circle-outline' : 'mdi-checkbox-blank-circle-outline'"
                        v-for="node in learningObjects.data"
                    >
                        <template v-slot:append>
                            {{ node.estimatedTime }}'
                        </template>
                    </v-list-item>
                </using-remote-resource>
            </div>
        </v-navigation-drawer>
        <v-btn
            :icon="navigationDrawerShown ? 'mdi-menu-open' : 'mdi-menu'"
            class="navigation-drawer-toggle-button"
            variant="plain"
            @click="navigationDrawerShown = !navigationDrawerShown"></v-btn>
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
    </using-remote-resource>
</template>

<style scoped>
    .navigation-drawer-toggle-button {
        margin-bottom: -30px;
        margin-left: 5px;
    }
    .navigation-buttons-container {
        padding: 20px;
        display: flex;
        justify-content: space-between;
    }
</style>
