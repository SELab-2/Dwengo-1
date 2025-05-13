<script setup lang="ts">
    import { ref, watch } from "vue";
    import { deadlineRules } from "@/utils/assignment-rules.ts";

    const emit = defineEmits<(e: "update:deadline", value: Date) => void>();

    const datetime = ref("");

    // Watch the datetime value and emit the update
    watch(datetime, (val) => {
        const newDate = new Date(val);
        if (!isNaN(newDate.getTime())) {
            emit("update:deadline", newDate);
        }
    });
</script>

<template>
    <v-card-text>
        <v-text-field
            v-model="datetime"
            type="datetime-local"
            label="Select Deadline"
            variant="outlined"
            density="compact"
            :rules="deadlineRules"
            required
        />
    </v-card-text>
</template>
