<script setup lang="ts">
    import auth from "@/services/auth/auth-service.ts";
    import MenuBar from "@/components/MenuBar.vue";
    auth.loadUser();
</script>

<template>
    <v-app>
        <menu-bar></menu-bar>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<style scoped></style>
