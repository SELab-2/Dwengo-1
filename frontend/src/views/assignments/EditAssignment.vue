<script setup lang="ts">
    import AssignmentForm from "@/views/assignments/AssignmentForm.vue";
    import {ref} from "vue";
    import {useRoute} from "vue-router";

    const sort = "edit";
    //TODO: use the id param to extract info about the assignment and pass them as props
    const route = useRoute();
    const assignmentId = ref(route.params.id as string);

    const handleUpdate = async (formData) => {
    };

</script>

<template>
    <AssignmentForm :sort="sort" @submit="handleUpdate"></AssignmentForm>
</template>

<style scoped>
</style>
