<script setup lang="ts">
    import {isLoggedIn, authState} from "@/store/auth-store.ts";
</script>

<template>
    <main>
        <!-- TODO Placeholder implementation to test the login - replace by a more beautiful page later -->
        <b>Welcome to the dwengo homepage</b>
        <div v-if="isLoggedIn">
            <p>Hello {{authState.user?.profile.name}}!</p>
            <p>Your access token for the backend is: <code>{{authState.user?.access_token}}</code></p>
        </div>
    </main>
</template>
<style scoped>

</style>
