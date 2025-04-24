<script setup lang="ts">
    import { computed } from "vue";
import { useI18n } from "vue-i18n";

    const { t } = useI18n();

    const props = defineProps<{
        path: string;
        isAbsolutePath?: boolean;
        title: string;
        description: string;
        image?: string;
        icon?: string;
    }>();

    const routerLink = computed(() => props.isAbsolutePath ? props.path : `/theme/${props.path}`);
</script>

<template>
    <v-card
        variant="outlined"
        class="theme-card d-flex flex-column"
        :to="routerLink"
        link
    >
        <v-card-title class="title-container">
            <v-img
                v-if="image"
                :src="image"
                height="40px"
                width="40px"
                contain
                class="title-image"
            ></v-img>
            <v-icon
                v-if="icon"
                class="title-image"
            >{{ icon }}</v-icon>

            <span class="title">{{ title }}</span>
        </v-card-title>
        <v-card-text class="description flex-grow-1">{{ description }}</v-card-text>
        <v-card-actions>
            <v-btn
                :to="routerLink"
                variant="text"
            >
                {{ t("read-more") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
    .theme-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 1rem;
        cursor: pointer;
    }

    .theme-card:hover {
        background-color: rgba(0, 0, 0, 0.03);
    }

    .title-container {
        display: flex;
        align-items: center;
        gap: 10px;
        text-align: left;
        justify-content: flex-start;
    }

    .title-image {
        flex-shrink: 0;
        border-radius: 5px;
        margin-left: 0;
    }

    .title {
        flex-grow: 1;
        white-space: normal;
        overflow-wrap: break-word;
        word-break: break-word;
    }
</style>
