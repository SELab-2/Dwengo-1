<script setup lang="ts">
    import {Language} from "@/services/learning-content/language.ts";
    import {getLearningPath} from "@/services/learning-content/learning-path-service.ts";
    import UsingRemoteResource from "@/components/UsingRemoteResource.vue";
    import type {LearningPath} from "@/services/learning-content/learning-path.ts";
    import {onMounted, reactive, watch} from "vue";
    import type {LearningObject} from "@/services/learning-content/learning-object.ts";
    import {useRouter} from "vue-router";
    import type {SuccessState} from "@/services/api-client/remote-resource.ts";

    const router = useRouter();
    const props = defineProps<{hruid: string, language: Language, learningObjectHruid?: string}>()

    const learningPathResource = reactive(getLearningPath(props.hruid, props.language));

    if (!props.learningObjectHruid) {
        watch(() => learningPathResource.state, (newValue) => {
            console.log("state changed!!");
            if (newValue.type === "success") {
                router.push(router.currentRoute.value.path
                    + "/" + (newValue as SuccessState<LearningPath>).data.startNode.learningobjectHruid);
            }
        });
    }

</script>

<template>
    <using-remote-resource :resource="learningPathResource" v-slot="learningPath: {data: LearningPath}">
        <v-navigation-drawer>
            <v-list-item
                :title="learningPath.data.title"
                :subtitle="learningPath.data.description"
            ></v-list-item>
            <v-divider></v-divider>

            <div v-if="props.learningObjectHruid">
                <using-remote-resource
                    :resource="learningPath.data.learningObjectsAsList"
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
    </using-remote-resource>
</template>

<style scoped>

</style>
