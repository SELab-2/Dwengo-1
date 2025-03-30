<script setup lang="ts">
    import { useRoute } from "vue-router";
    import {ref, onMounted, computed} from "vue";
    import {useI18n} from "vue-i18n";
    import {assignments} from "@/utils/tempData.ts";
    import auth from "@/services/auth/auth-service.ts";

    const {t} = useI18n();
    const route = useRoute();
    const assignmentId = ref(route.params.id as string);
    const assignment = ref(null);

    const role = auth.authState.activeRole;
    const isTeacher = computed(() => role === 'teacher');

    onMounted(async () => {
        try {
            // TODO: Replace with real data
            assignment.value = assignments[0];
        } catch (error) {
            console.error(error);
        }
    });
</script>

<template>
    <div class="container">
        <v-card v-if="assignment" class="assignment-card">
            <div class="top-buttons">
                <v-btn
                    icon
                    variant="text"
                    class="back-btn"
                    to="user/assignment"
                >
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>

                <v-btn
                    v-if="isTeacher"
                    icon
                    variant="text"
                    class="edit-btn"
                    :to="`/assignment/${assignmentId}/edit`"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </div>
            <v-card-title class="text-h4">{{ assignment.title }}</v-card-title>
            <v-card-subtitle>
                <v-btn
                    :to="`/learningPath/${assignment.learningPathHruid}`"
                    variant="tonal"
                    color="primary"
                >
                    {{ t("learning-path") }}
                </v-btn>
            </v-card-subtitle>

            <v-card-text class="description">
                {{ assignment.description }}
            </v-card-text>
        </v-card>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2%;
    min-height: 100vh;
}

.assignment-card {
    width: 90%;
    max-width: 900px;
    padding: 2%;
    border-radius: 12px;
}

.description {
    margin-top: 2%;
    line-height: 1.6;
    font-size: 1.1rem;
}

</style>

