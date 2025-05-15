<script setup lang="ts">
import type { Language } from '@/data-objects/language';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const props = defineProps<{
    hruid: string;
    language: Language;
    learningObjectHruid?: string;
}>();

const discussionURL = "/discussion" 
    + "/" + props.hruid
    + "/" + props.language
    + "/" + props.learningObjectHruid

router.replace(discussionURL);

</script>

<template>
    <main></main>
</template>

<style scoped></style>
