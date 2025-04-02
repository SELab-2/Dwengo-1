<script setup lang="ts">
    import { useRouter } from "vue-router";
    import { onMounted, ref, type Ref } from "vue";
    import auth from "../services/auth/auth-service.ts";

    const router = useRouter();

    const errorMessage: Ref<string | null> = ref(null);

    onMounted(async () => {
        try {
            await auth.handleLoginCallback();
            await router.replace("/user"); // Redirect to theme page
        } catch (error) {
            errorMessage.value = `OIDC callback error: ${error}`;
        }
    });
</script>

<template>
    <p v-if="!errorMessage">Logging you in...</p>
    <p v-else>{{ errorMessage }}</p>
</template>

<style scoped></style>
