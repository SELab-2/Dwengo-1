<script setup lang="ts">
    import authState from "@/services/auth/auth-service.ts";
    import TeacherClasses from "./TeacherClasses.vue";
    import StudentClasses from "./StudentClasses.vue";
    import {AccountType} from "@dwengo-1/common/util/account-types";

    // Determine if role is student or teacher to render correct view
    const role: string = authState.authState.activeRole!;
</script>

<template>
    <main>
        <TeacherClasses v-if="role === AccountType.Teacher"></TeacherClasses>
        <StudentClasses v-else></StudentClasses>
    </main>
</template>

<style scoped></style>
