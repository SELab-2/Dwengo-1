<script setup lang="ts">
    // This component contains a list with all themes and will be shown on a student's and teacher's homepage.
    import ThemeCard from "@/components/ThemeCard.vue";
    const cards = [
        {
            key: "1",
            title: "Card 1",
            description: "This is card 1",
            image: "https://via.placeholder.com/150",
        },
        {
            key: "2",
            title: "Card 2",
            description: "This is card 2",
            image: "https://via.placeholder.com/150",
        },
        {
            key: "3",
            title: "Card 3",
            description: "This is card 3",
            image: "https://via.placeholder.com/150",
        },
        {
            key: "4",
            title: "Card 4",
            description: "This is card 4",
            image: "https://via.placeholder.com/150",
        },
    ];



</script>

<template>
    <v-container>
        <v-row>
            <v-col
                v-for="(card, index) in cards"
                :key="index"
                cols="12"
                sm="6"
                md="4"
                lg="3"
            >
                <ThemeCard
                    :path="card.key"
                    :title="card.title"
                    :description="card.description"
                    :image="card.image"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped></style>
