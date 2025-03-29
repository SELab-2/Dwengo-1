<script setup lang="ts">
import { ref, computed, defineEmits } from "vue";

const date = ref("");
const time = ref("");
const emit = defineEmits(["update:deadline"]);

const formattedDeadline = computed(() => {
    if (!date.value || !time.value) return "";
    return `${date.value} ${time.value}`;
});

const updateDeadline = () => {
    if (date.value && time.value) {
        emit("update:deadline", formattedDeadline.value);
    }
};
</script>

<template>
    <div>
        <v-card-text>
            <v-text-field
                v-model="date"
                label="Select Deadline Date"
                type="date"
                variant="outlined"
                density="compact"
                @update:modelValue="updateDeadline"
            ></v-text-field>
        </v-card-text>

        <v-card-text>
            <v-text-field
                v-model="time"
                label="Select Deadline Time"
                type="time"
                variant="outlined"
                density="compact"
                @update:modelValue="updateDeadline"
            ></v-text-field>
        </v-card-text>
    </div>
</template>

<style scoped>

</style>
