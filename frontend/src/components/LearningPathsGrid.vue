<script setup lang="ts">

import {convertBase64ToImageSrc} from "@/utils/base64ToImage.ts";
import type {LearningPath} from "@/data-objects/learning-paths/learning-path.ts";
import {useI18n} from "vue-i18n";

const { t } = useI18n();
const props = defineProps<{learningPaths: LearningPath[]}>();

</script>

<template>
    <div class="results-grid" v-if="props.learningPaths.length > 0">
        <v-card
            class="learning-path-card"
            link
            :to="`/learningPath/${learningPath.hruid}/${learningPath.language}/${learningPath.startNode.learningobjectHruid}`"
            :key="`${learningPath.hruid}/${learningPath.language}`"
            v-for="learningPath in props.learningPaths"
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
</template>

<style scoped>
    .learning-path-card {
        width: 300px;
    }
    .results-grid {
        margin: 20px;
        display: flex;
        align-items: stretch;
        gap: 20px;
        flex-wrap: wrap;
    }
</style>
