<script setup lang="ts">
    import ThemeCard from "@/components/ThemeCard.vue";
    import {onMounted, ref} from "vue";
    const cards = ref<Array<{ key: string; title: string; description: string; image: string }>>([]);

    const fetchThemes = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/theme");
            cards.value = await response.json();
        } catch (error) {
            console.error("Error fetching themes:", error);
        }
    };

    onMounted(fetchThemes);
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
