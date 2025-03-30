<script setup lang="ts">
    import AssignmentForm from "@/views/assignments/AssignmentForm.vue";
    const sort = "new";

    const handleSubmit = async (formData) => {
        /*await fetch('/api/assignments', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        });*/
    };

</script>

<template>
    <AssignmentForm :sort="sort" @submit="handleSubmit"></AssignmentForm>
</template>

<style scoped>
</style>
