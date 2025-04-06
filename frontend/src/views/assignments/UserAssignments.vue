<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { useRouter } from 'vue-router';
    import auth from "@/services/auth/auth-service.ts";
    import {assignments} from "@/utils/tempData.ts";

    const { t } = useI18n();
    const router = useRouter();

    const role = auth.authState.activeRole;

    const allAssignments = ref(assignments);
    const isTeacher = computed(() => role === 'teacher');

    const loadAssignments = async () => {
        //TODO: replace with controller function
        // fetch all student's or teacher's assignments
    };



    onMounted(loadAssignments);

    const goToCreateAssignment = () => {
        router.push('/assignment/create');
    };

    const goToEditAssignment = (id: string) => {
        router.push(`/assignment/${id}/edit`);
    };

    const goToAssignmentDetails = (id: string) => {
        router.push(`/assignment/${id}`);
    };

    const goToDeleteAssignment = (id: string) => {
    };
</script>

<template>
    <div class="assignments-container">
        <h1>{{ t('assignments') }}</h1>

        <v-btn
            v-if="isTeacher"
            color="primary"
            class="mb-4"
            @click="goToCreateAssignment"
        >
            {{ t('new-assignment') }}
        </v-btn>

        <v-container>
            <v-row>
                <v-col
                    v-for="assignment in allAssignments"
                    :key="assignment.id"
                    cols="12"
                >
                    <v-card class="assignment-card" variant="outlined">
                        <v-card-text class="card-content">
                            <div class="left-content">
                                <div class="assignment-title">{{ assignment.title }}</div>
                                <div class="assignment-class">
                                    {{ t('class') }}:
                                    <span class="class-name">
                    {{ assignment.class }}
                  </span>
                                </div>
                            </div>
                            <div class="right-content">
                                <v-btn
                                    color="primary"
                                    @click="goToAssignmentDetails(assignment.id)"
                                >
                                    {{ t('view-assignment') }}
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>


<style scoped>
.assignments-container {
    width: 100%;
    margin: 0 auto;
    padding: 2% 4%;
    box-sizing: border-box;
}

.assignment-card {
    padding: 1rem;
}

.card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.left-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 200px;
    max-width: 70%;
}

.assignment-title {
    font-weight: bold;
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
    word-break: break-word;
}

.assignment-class {
    color: #666;
    font-size: 0.95rem;
}

.class-name {
    font-weight: 500;
    color: #333;
}

.right-content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-shrink: 0;
}
</style>
