<script setup lang="ts">
    import type { Language } from "@/data-objects/language";
    import { onMounted } from "vue";
    import { useRouter } from "vue-router";

    const router = useRouter();

    const props = defineProps<{
        hruid: string;
        language: Language;
        learningObjectHruid?: string;
    }>();

    const discussionURL = "/discussion" + "/" + props.hruid + "/" + props.language + "/" + props.learningObjectHruid;

    onMounted(async () => {
        await router.replace(discussionURL);
    });
</script>

<template>
    <main></main>
</template>

<style scoped></style>
