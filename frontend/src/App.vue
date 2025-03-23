<script setup lang="ts">
    import auth from "@/services/auth/auth-service.ts";
    await auth.loadUser();
</script>

<template>
    <router-view />
</template>

<style scoped></style>
