<script setup lang="ts">
    import {Language} from "@/services/learning-content/language.ts";
    import {getLearningPath} from "@/services/learning-content/learning-path-service.ts";
    import UsingRemoteResource from "@/components/UsingRemoteResource.vue";
    import {type LearningPath} from "@/services/learning-content/learning-path.ts";
    import {computed, watch, watchEffect} from "vue";
    import type {LearningObject} from "@/services/learning-content/learning-object.ts";
    import {useRouter} from "vue-router";
    import {loadResource, remoteResource, type SuccessState} from "@/services/api-client/remote-resource.ts";
    import LearningObjectView from "@/views/learning-paths/LearningObjectView.vue";

    const router = useRouter();
    const props = defineProps<{hruid: string, language: Language, learningObjectHruid?: string}>()

    const learningPathResource = remoteResource<LearningPath>();
    watchEffect(() => {
        loadResource(learningPathResource, getLearningPath(props.hruid, props.language));
    });

    const learningObjectListResource = remoteResource<LearningObject[]>();
    watch(learningPathResource, () => {
        if (learningPathResource.state.type === "success") {
            loadResource(learningObjectListResource, learningPathResource.state.data.learningObjectsAsList)
        }
    }, {immediate: true});

    const currentNode = computed(() => {
        let currentHruid = props.learningObjectHruid;
        if (learningPathResource.state.type === "success") {
            return learningPathResource.state.data.nodesAsList.filter(it => it.learningobjectHruid === currentHruid)[0]
        } else {
            return undefined;
        }
    });

    if (!props.learningObjectHruid) {
        watch(() => learningPathResource.state, (newValue) => {
            if (newValue.type === "success") {
                router.push(router.currentRoute.value.path
                    + "/" + (newValue as SuccessState<LearningPath>).data.startNode.learningobjectHruid);
            }
        });
    }
</script>

<template>
    <using-remote-resource
        :resource="learningPathResource"
        v-slot="learningPath: {data: LearningPath}"
    >
        <v-navigation-drawer>
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
                        :to="node.key"
                        :title="node.title"
                        :active="node.key === props.learningObjectHruid"
                        v-for="node in learningObjects.data"
                    >
                        <template v-slot:append>
                            {{ node.estimatedTime }}'
                        </template>
                    </v-list-item>
                </using-remote-resource>
            </div>
        </v-navigation-drawer>
        <learning-object-view
            :hruid="currentNode.learningobjectHruid"
            :language="currentNode.language"
            :version="currentNode.version"
            v-if="currentNode"
        ></learning-object-view>
    </using-remote-resource>
</template>

<style scoped>

</style>
