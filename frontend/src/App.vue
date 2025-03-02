<script setup lang="ts">
    import {loadUser} from "@/store/auth-store.ts";
    loadUser();
</script>

<template>
    <router-view/>
</template>

<style scoped>

</style>
