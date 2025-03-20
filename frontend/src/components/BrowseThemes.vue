<script setup lang="ts">
    import ThemeCard from "@/components/ThemeCard.vue";
    import { ref, onMounted, watch } from "vue";
    import { useI18n } from "vue-i18n";
    import {THEMESITEMS} from "@/utils/constants.ts";

    // Receive the selectedTheme from the parent component
    const props = defineProps<{ selectedTheme: string }>();

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
            //console.log(allCards.value);
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
        if (newTheme && newTheme !== "all") {
            cards.value = allCards.value.filter(theme => THEMESITEMS[newTheme].includes(theme.key));
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
