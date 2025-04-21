<script setup lang="ts">
    import auth from "@/services/auth/auth-service.ts";
    import MenuBar from "@/components/MenuBar.vue";
    import { useRoute } from "vue-router";
    import { computed } from "vue";

    const route = useRoute();
    interface RouteMeta {
        requiresAuth?: boolean;
    }

    const showMenuBar = computed(() => (route.meta as RouteMeta).requiresAuth && auth.authState.user);
</script>

<template>
    <v-app>
        <menu-bar v-if="showMenuBar"></menu-bar>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<style scoped></style>
