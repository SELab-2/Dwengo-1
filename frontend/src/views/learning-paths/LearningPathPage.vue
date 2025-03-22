<script setup lang="ts">
    import {ref} from "vue";
    const learningObjects = ref([

    ])
</script>

<template>
    <v-navigation-drawer>
        <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
        <v-divider></v-divider>
        <v-list-item link title="List Item 1"></v-list-item>
        <v-list-item link title="List Item 2"></v-list-item>
        <v-list-item link title="List Item 3"></v-list-item>
    </v-navigation-drawer>
</template>

<style scoped>

</style>
