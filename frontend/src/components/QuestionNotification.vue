<script setup lang="ts">
import type { LearningObject } from "@/data-objects/learning-objects/learning-object";
import { useQuestionsQuery } from "@/queries/questions";
import type { LearningObjectIdentifierDTO } from "@dwengo-1/common/interfaces/learning-content";
import { computed } from 'vue';

const props = defineProps<{
        node: LearningObject;
    }>();

    const loid = {
        hruid: props.node.key,
        version: props.node.version,
        language: props.node.language,} as LearningObjectIdentifierDTO;
const { data  } = useQuestionsQuery(loid);

    const hasQuestions = computed(() => (data.value?.questions.length ?? 0) > 0);

</script>
<template v-if="!isLoading & !error">
    <v-icon
        v-if="hasQuestions"
        icon="mdi-help-circle-outline"
        color="red"
        size="small"
    />
</template>
<style scoped></style>
