<script setup lang="ts">
    import auth from "@/services/auth/auth-service.ts";
    import { computed, ref } from "vue";
    import StudentAssignment from "@/views/assignments/StudentAssignment.vue";
    import TeacherAssignment from "@/views/assignments/TeacherAssignment.vue";
    import { useRoute } from "vue-router";
    import { AccountType } from "@dwengo-1/common/util/account-types";

    const role = auth.authState.activeRole;
    const isTeacher = computed(() => role === AccountType.Teacher);

    const route = useRoute();
    const classId = ref<string>(route.params.classId as string);
    const assignmentId = ref(Number(route.params.id));
</script>

<template>
    <TeacherAssignment
        :class-id="classId"
        :assignment-id="assignmentId"
        v-if="isTeacher"
    >
    </TeacherAssignment>
    <StudentAssignment
        :class-id="classId"
        :assignment-id="assignmentId"
        v-else
    >
    </StudentAssignment>
</template>

<style scoped></style>
