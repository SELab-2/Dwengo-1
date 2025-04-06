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

    const loadAssignment = async () => {
        // TODO: Replace with real data
        assignment.value = assignments[0];
    };

    const myUsername = "id01"; //TODO: replace by username of logged in user


    // Display group members
    const myGroup = computed(() => {
        if (!assignment.value || !assignment.value.groups) return null;
        console.log(assignment.value.groups)
        return assignment.value.groups.find(group =>
            group.members.some(m => m.username === myUsername)
        );
    });

    const deleteAssignment = () => {
        console.log('Delete assignment:', assignmentId.value);
    };

    onMounted(loadAssignment);

</script>

<template>
    <div class="container">
        <v-card v-if="assignment" class="assignment-card">
            <div class="top-buttons">
                <v-btn
                    icon
                    variant="text"
                    class="back-btn"
                    to="/user/assignment"
                >
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>

                <v-btn
                    v-if="isTeacher"
                    icon
                    variant="text"
                    class="delete-btn"
                    @click="deleteAssignment"
                >
                    <v-icon>mdi-delete</v-icon>
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

            <v-card-text class="group-section">
                <h3>{{ t("group") }}</h3>

                <!-- Student view -->
                <div v-if="!isTeacher">
                    <div v-if="myGroup">
                        <ul>
                            <li v-for="student in myGroup.members" :key="student.username">
                                {{ student.firstName + ' ' + student.lastName}}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Teacher view -->
                <div v-else>
                    <v-expansion-panels>
                        <v-expansion-panel
                            v-for="(group, index) in assignment.groups"
                            :key="group.id"
                        >
                            <v-expansion-panel-title>
                                {{ t("group") }} {{ index + 1 }}
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <ul>
                                    <li v-for="student in group.members" :key="student.username">
                                        {{ student.firstName + ' ' + student.lastName }}
                                    </li>
                                </ul>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
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
    width: 85%;
    padding: 2%;
    border-radius: 12px;
}

.description {
    margin-top: 2%;
    line-height: 1.6;
    font-size: 1.1rem;
}

.delete-btn {
    position: absolute;
    right: 1%;
    color: red;
}

.group-section {
    margin-top: 2rem;
}

.group-section h3 {
    margin-bottom: 0.5rem;
}

.group-section ul {
    padding-left: 1.2rem;
    list-style-type: disc;
}


</style>

