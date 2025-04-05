<script setup lang="ts">
    import authState from "@/services/auth/auth-service.ts";
    import TeacherClasses from "./TeacherClasses.vue";
    import StudentClasses from "./StudentClasses.vue";

    // determine if role is student or teacher to render correct view
    const role: string = authState.authState.activeRole!;
</script>

<template>
    <main>
        <TeacherClasses v-if="role === 'teacher'"></TeacherClasses>
        <StudentClasses v-else></StudentClasses>
    </main>
</template>

<style scoped></style>
