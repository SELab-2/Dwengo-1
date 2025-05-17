<script setup lang="ts">
    import { ref, watch } from "vue";

    const emit = defineEmits<(e: "update:deadline", value: Date | null) => void>();
    const props = defineProps<{ deadline: Date | null }>();

    const datetime = ref("");

    datetime.value = props.deadline ? new Date(props.deadline).toISOString().slice(0, 16) : "";

    // Watch the datetime value and emit the update
    watch(datetime, (val) => {
        const newDate = new Date(val);
        if (!isNaN(newDate.getTime())) {
            emit("update:deadline", newDate);
        } else {
            emit("update:deadline", null);
        }
    });

    const deadlineRules = [
        (value: string): string | boolean => {
            const selectedDateTime = new Date(value);
            const now = new Date();

            if (isNaN(selectedDateTime.getTime())) {
                return t("deadline-invalid");
            }

            if (selectedDateTime <= now) {
                return t("deadline-past");
            }

            return true;
        },
    ];
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
