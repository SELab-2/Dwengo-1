<script setup lang="ts">
    import auth from "@/services/auth/auth-service.ts";
    import apiClient from "@/services/api-client/api-client.ts";
    import { ref } from "vue";

    const testResponse = ref(null);

    async function testAuthenticated() {
        testResponse.value = await apiClient.get("/auth/testAuthenticatedOnly");
    }
</script>

<template>
    <main>
        <!-- TODO Placeholder implementation to test the login - replace by a more beautiful page later -->
        <b>Welcome to the dwengo homepage</b>
        <div v-if="auth.isLoggedIn.value">
            <p>Hello {{ auth.authState.user?.profile.name }}!</p>
            <p>
                Your access token for the backend is: <code>{{ auth.authState.user?.access_token }}</code>
            </p>
        </div>

        <v-btn @click="testAuthenticated">Send test request</v-btn>
        <p v-if="testResponse">Response from the test request: {{ testResponse }}</p>
    </main>
</template>
<style scoped></style>
