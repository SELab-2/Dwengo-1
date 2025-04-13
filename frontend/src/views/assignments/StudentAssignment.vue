<script setup lang="ts">
import {ref, computed, defineProps} from "vue";
import auth from "@/services/auth/auth-service.ts";
import {useI18n} from "vue-i18n";
import {useAssignmentQuery} from "@/queries/assignments.ts";
import UsingQueryResult from "@/components/UsingQueryResult.vue";
import type {AssignmentResponse} from "@/controllers/assignments.ts";
import type {GroupDTO} from "@dwengo-1/common/interfaces/group";
import {asyncComputed} from "@vueuse/core";
import {useStudentsByUsernamesQuery} from "@/queries/students.ts";
import {AssignmentDTO} from "@dwengo-1/common/dist/interfaces/assignment.ts";
import {StudentDTO} from "@dwengo-1/common/dist/interfaces/student.ts";

const props = defineProps<{
    classId: string
    assignmentId: number
    groups: GroupDTO[] | undefined
}>();

const {t, locale} = useI18n();
const language = computed(() => locale.value);
// Get the user's username/id
const username = asyncComputed(async () => {
    const user = await auth.loadUser();
    return user?.profile?.preferred_username ?? undefined
});

const assignmentQueryResult = useAssignmentQuery(() => props.classId, props.assignmentId);

const submitted = ref(true);//TODO: update by fetching submissions and check group

const submitAssignment = async () => {
    //TODO
};

const group = computed(() => {
    return props?.groups?.find(group =>
        group.members.some(m => m.username === username.value)
    );
    /** For testing
    return {assignment: 1,
        groupNumber: 1,
        members: ["testleerling1"]}
        */
});

// Assuming group.value.members is a list of usernames TODO: case when it's StudentDTO's
const studentQueries = useStudentsByUsernamesQuery(() => group.value?.members as string[]);

</script>

<template>
    <div class="container">
        <using-query-result
            :query-result="assignmentQueryResult"
            v-slot="{ data }: {data: AssignmentResponse}"
        >
            <v-card v-if="data" class="assignment-card">
                <div class="top-buttons">
                    <v-btn
                        icon
                        variant="text"
                        class="back-btn"
                        to="/user/assignment"
                    >
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>

                    <v-chip
                        v-if="submitted"
                        class="ma-2 top-right-btn"
                        label
                        color="success"
                    >
                        {{ t("submitted") }}
                    </v-chip>
                </div>
                <v-card-title class="text-h4">{{ data.title }}</v-card-title>
                <v-card-subtitle class="subtitle-section">
                    <v-btn
                        :to="`/learningPath/${language}/${data.learningPath}`"
                        variant="tonal"
                        color="primary"
                    >
                        {{ t("learning-path") }}
                    </v-btn>
                </v-card-subtitle>

                <v-card-text class="description">
                    {{ data.description }}
                </v-card-text>

                <v-card-text class="group-section">
                    <h3>{{ t("group") }}</h3>
                    <div v-if="studentQueries">
                        <ul>
                            <li v-for="student in studentQueries" :key="student.data?.student.id">
                                {{ student.data?.student.firstName + ' ' + student.data?.student.lastName }}
                            </li>
                        </ul>
                    </div>

                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn
                        size="large"
                        color="success"
                        variant="flat"
                        @click="submitAssignment"
                    >
                        {{ t("submit") }}
                    </v-btn>
                </v-card-actions>

            </v-card>
        </using-query-result>
    </div>
</template>

<style scoped>
@import "@/assets/assignment.css";

</style>

