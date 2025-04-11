<script setup lang="ts">

import auth from "@/services/auth/auth-service.ts";
import {computed} from "vue";
import StudentAssignment from "@/views/assignments/StudentAssignment.vue";
import TeacherAssignment from "@/views/assignments/TeacherAssignment.vue";

const role = auth.authState.activeRole;
const isTeacher = computed(() => role === 'teacher');

</script>

<template>
    <StudentAssignment v-if="!isTeacher"></StudentAssignment>
    <TeacherAssignment v-else></TeacherAssignment>
</template>

<style scoped>
</style>

