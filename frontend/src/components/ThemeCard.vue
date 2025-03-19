<script setup lang="ts">
    import { useI18n } from "vue-i18n";

    const { t } = useI18n();

    defineProps<{
        path: string;
        title: string;
        description: string;
        image: string;
    }>();
</script>

<template>
    <v-card :title="t(`${title}`)" :text="t(`${description}`)" variant="outlined">
        <v-img v-if="image" :src="image" height="200px" cover></v-img>
        <v-card-actions>
            <v-btn :to="`theme/${path}`" variant="text">
                {{ t("read-more") }}
            </v-btn>

        </v-card-actions>
    </v-card>
</template>

<style scoped>
</style>
