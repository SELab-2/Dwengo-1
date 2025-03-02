<script setup lang="ts">
    import {useRouter} from "vue-router";
    import {onMounted} from "vue";
    import {handleLoginCallback} from "@/store/auth-store.ts";

    const router = useRouter();

    onMounted(async () => {
        try {
            await handleLoginCallback();
            await router.replace("/"); // Redirect to home (or dashboard)
        } catch (error) {
            console.error("OIDC callback error:", error);
        }
    });
</script>

<template>
    <p>Logging you in...</p>
</template>

<style scoped>

</style>
