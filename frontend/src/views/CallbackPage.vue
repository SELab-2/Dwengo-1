<script setup lang="ts">
    import { useRouter } from "vue-router";
    import { onMounted } from "vue";
    import auth from "../services/auth/auth-service.ts";

    const router = useRouter();

    onMounted(async () => {
        try {
            await auth.handleLoginCallback();
            await router.replace("/"); // Redirect to home (or dashboard)
        } catch (error) {
            console.error("OIDC callback error:", error);
        }
    });
</script>

<template>
    <p>Logging you in...</p>
</template>

<style scoped></style>
