<script setup lang="ts">

import {isLoggedIn, loginAs, logout, authState} from "@/store/auth-store.ts";

    function loginAsStudent() {
        loginAs("student");
    }

    function loginAsTeacher() {
        loginAs("teacher");
    }

    function performLogout() {
        logout();
    }
</script>

<template>
    <main>
        <!-- TODO Placeholder implementation to test the login - replace by a more beautiful page later -->
        <div v-if="!isLoggedIn">
            <p>You are currently not logged in.</p>
            <v-btn @click="loginAsStudent">Login as student</v-btn>
            <v-btn @click="loginAsTeacher">Login as teacher</v-btn>
        </div>
        <div v-if="isLoggedIn">
            <p>You are currently logged in as {{ authState.user!.profile.name }} ({{ authState.activeRole }})</p>
            <v-btn @click="performLogout">Logout</v-btn>
        </div>
    </main>
</template>

<style scoped>

</style>
