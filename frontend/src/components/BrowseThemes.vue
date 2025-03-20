<script setup lang="ts">
import ThemeCard from "@/components/ThemeCard.vue";
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const cards = ref<Array<{ key: string; title: string; description: string; image: string }>>([]);

// Fetch themes based on the current language
const fetchThemes = async () => {
    try {
        const language = localStorage.getItem("user-lang") || locale.value;
        const response = await fetch(`http://localhost:3000/api/theme?language=${language}`);
        cards.value = await response.json();
        console.log(cards.value);
    } catch (error) {
        console.error("Error fetching themes:", error);
    }
};

onMounted(fetchThemes);

// Refetch themes when language changes
watch(locale, () => {
    fetchThemes();
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
