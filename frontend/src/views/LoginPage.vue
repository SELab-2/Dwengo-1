<script setup lang="ts">
    import { useRoute } from "vue-router";
    import dwengoLogo from "../../../assets/img/dwengo-groen-zwart.svg";

    const route = useRoute();

    const userId = 1;
</script>

<template>
    <main>
        <img
            class="dwengo_logo"
            :src="dwengoLogo"
        />
        <div>
            <p>login</p>
            <v-btn
                :to="`/teacher/${userId}`"
                append-icon="$vuetify"
            >
                teacher
            </v-btn>
            <v-btn
                :to="`/student/${userId}`"
                append-icon="$vuetify"
            >
                student
            </v-btn>
        </div>
    </main>
</template>

<style scoped></style>
