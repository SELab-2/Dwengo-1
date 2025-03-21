<script setup lang="ts">
    import ThemeCard from "@/components/ThemeCard.vue";
    import { ref, onMounted, watch } from "vue";
    import { useI18n } from "vue-i18n";
    import {AGE_TO_THEMES, THEMESITEMS} from "@/utils/constants.ts";

    // Receive the selectedTheme and selectedAge from the parent component
    const props = defineProps({
        selectedTheme: {
            type: String,
            required: true
        },
        selectedAge: {
            type: String,
            required: true
        }
    });

    const {locale} = useI18n();

    const allCards = ref<Array<{ key: string; title: string; description: string; image: string }>>([]);
    const cards = ref<Array<{ key: string; title: string; description: string; image: string }>>([]);

    // Fetch all themes based on the current language
    async function fetchThemes() {
        try {
            // Get the current selected language
            const language = locale.value;
            const response = await fetch(`http://localhost:3000/api/theme?language=${language}`);

            // Update the cards value with the fetched themes
            allCards.value = await response.json();
            cards.value = allCards.value;
        } catch (error) {
            console.error("Error fetching themes:", error);
        }
    }

    // Fetch on mount
    onMounted(fetchThemes);

    // Re-fetch themes when language changes
    watch(locale, () => {
        fetchThemes();
    });

    // Watch for selectedTheme change and filter themes
    watch(() => props.selectedTheme, (newTheme) => {
        if (newTheme) {
            cards.value = allCards.value.filter(theme => THEMESITEMS[newTheme].includes(theme.key) && AGE_TO_THEMES[props.selectedAge]?.includes(theme.key));
        } else {
            cards.value = allCards.value;
        }
    });

    // Watch for selectedAge change and filter themes
    watch(() => props.selectedAge, (newAge) => {
        if (newAge) {
            cards.value = allCards.value.filter(theme => THEMESITEMS[props.selectedTheme].includes(theme.key) && AGE_TO_THEMES[newAge]?.includes(theme.key));
        } else {
            cards.value = allCards.value;
        }
    });


</script>

<template>
    <v-container>
        <v-row>
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
