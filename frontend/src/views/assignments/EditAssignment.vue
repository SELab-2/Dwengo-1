<script setup lang="ts">
import AssignmentForm from "@/views/assignments/AssignmentForm.vue";

const sort = "edit";
//TODO: use the id param to extract info about the assignment
</script>

<template>
    <AssignmentForm :sort="sort"></AssignmentForm>
</template>

<style scoped>
</style>
