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
</script>

<template>
    <div class="assignments-container">
        <h1>{{ t('assignments') }}</h1>

        <v-btn v-if="isTeacher" color="primary" class="mb-4" @click="goToCreateAssignment">
            {{ t('new-assignment') }}
        </v-btn>

        <v-container>
            <v-row>
                <v-col v-for="assignment in allAssignments" :key="assignment.id" cols="12">
                    <v-card class="assignment-card" variant="outlined">
                        <v-card-title class="title">{{ assignment.title }}</v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="description-text" >{{ assignment.description }}</v-card-text>

                        <v-card-actions>
                            <v-btn color="primary" @click="goToAssignmentDetails(assignment.id)">
                                {{ t('view-assignment') }}
                            </v-btn>
                            <v-btn v-if="isTeacher" color="secondary" @click="goToEditAssignment(assignment.id)">
                                {{ t('edit') }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

    </div>
</template>

<style scoped>
.assignments-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2%;
}

.assignment-card {
    padding: 1%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

h1 {
    text-align: left;
    width: 100%;
}

.title {
    flex-grow: 1;
    white-space: normal;
    overflow-wrap: break-word;
    word-break: break-word;
}

.description-text {
    display: -webkit-box;
    -webkit-line-clamp: 3;  /* Limit to 3 lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

</style>
