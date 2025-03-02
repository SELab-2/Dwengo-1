<script setup lang="ts">
    import auth from "@/services/auth/auth-service.ts";

    function loginAsStudent() {
        auth.loginAs("student");
    }

    function loginAsTeacher() {
        auth.loginAs("teacher");
    }

    function performLogout() {
        auth.logout();
    }
</script>

<template>
    <main>
        <!-- TODO Placeholder implementation to test the login - replace by a more beautiful page later -->
        <div v-if="!auth.isLoggedIn.value">
            <p>You are currently not logged in.</p>
            <v-btn @click="loginAsStudent">Login as student</v-btn>
            <v-btn @click="loginAsTeacher">Login as teacher</v-btn>
        </div>
        <div v-if="auth.isLoggedIn.value">
            <p>You are currently logged in as {{ auth.authState.user!.profile.name }} ({{ auth.authState.activeRole }})</p>
            <v-btn @click="performLogout">Logout</v-btn>
        </div>
    </main>
</template>

<style scoped>

</style>
