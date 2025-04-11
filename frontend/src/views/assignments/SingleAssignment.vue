<script setup lang="ts">

import auth from "@/services/auth/auth-service.ts";
import {computed, ref} from "vue";
import StudentAssignment from "@/views/assignments/StudentAssignment.vue";
import TeacherAssignment from "@/views/assignments/TeacherAssignment.vue";
import {asyncComputed} from "@vueuse/core";
import {GroupController} from "@/controllers/groups.ts";
import {useRoute} from "vue-router";

const role = auth.authState.activeRole;
const isTeacher = computed(() => role === 'teacher');

// Get the user's username/id
const username = asyncComputed(async () => {
    const user = await auth.loadUser();
    return user?.profile?.preferred_username ?? undefined
});

const route = useRoute();
const assignmentId = ref(Number(route.params.id));
const classId = window.history.state?.class_id;

const groupController = new GroupController(classId, assignmentId.value);

const groupDTOs = asyncComputed(async () => await groupController.getAll(true));
console.log(groupDTOs.value);

</script>

<template>
    <TeacherAssignment
        :class-id="classId"
        :assignment-id="assignmentId"
        :groups="groupDTOs"
        v-if="isTeacher"
    >
    </TeacherAssignment>
    <StudentAssignment
        :class-id="classId"
        :assignment-id="assignmentId"
        :groups="groupDTOs"
        v-else
    >
    </StudentAssignment>
</template>

<style scoped>
</style>

