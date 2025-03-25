<script setup lang="ts">
    import auth from "@/services/auth/auth-service.ts";
    auth.loadUser();
</script>

<template>
    <v-app>
        <router-view />
    </v-app>
</template>

<style scoped></style>
