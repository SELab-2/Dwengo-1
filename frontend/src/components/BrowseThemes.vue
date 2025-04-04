<script setup lang="ts">
    import ThemeCard from "@/components/ThemeCard.vue";
    import { ref, watchEffect, computed } from "vue";
    import { useI18n } from "vue-i18n";
    import { AGE_TO_THEMES, THEMESITEMS } from "@/utils/constants.ts";
    import { useThemeQuery } from "@/queries/themes.ts";

    const props = defineProps({
        selectedTheme: { type: String, required: true },
        selectedAge: { type: String, required: true },
    });

    const { locale } = useI18n();
    const language = computed(() => locale.value);

    const { data: allThemes, isLoading, error } = useThemeQuery(language);

    const allCards = ref([]);
    const cards = ref([]);

    watchEffect(() => {
        const themes = allThemes.value ?? [];
        allCards.value = themes;

        if (props.selectedTheme) {
            cards.value = themes.filter(
                (theme) =>
                    THEMESITEMS[props.selectedTheme]?.includes(theme.key) &&
                    AGE_TO_THEMES[props.selectedAge]?.includes(theme.key),
            );
        } else {
            cards.value = themes;
        }
    });
</script>

<template>
    <v-container>
        <div
            v-if="isLoading"
            class="text-center py-10"
        >
            <v-progress-circular
                indeterminate
                color="primary"
            />
            <p>Loading...</p>
        </div>

        <div
            v-else-if="error"
            class="text-center py-10 text-error"
        >
            <v-icon large>mdi-alert-circle</v-icon>
            <p>Error loading: {{ error.message }}</p>
        </div>

        <v-row v-else>
            <v-col
                v-for="card in cards"
                :key="card.key"
                cols="12"
                sm="6"
                md="4"
                lg="4"
                class="d-flex"
            >
                <ThemeCard
                    :path="card.key"
                    :title="card.title"
                    :description="card.description"
                    :image="card.image"
                    class="fill-height"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped></style>
