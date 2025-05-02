<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import authState from "@/services/auth/auth-service.ts";
import auth from "@/services/auth/auth-service.ts";
import { useTeacherAssignmentsQuery, useTeacherClassesQuery } from "@/queries/teachers.ts";
import { useStudentAssignmentsQuery, useStudentClassesQuery } from "@/queries/students.ts";
import { ClassController } from "@/controllers/classes.ts";
import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
import { asyncComputed } from "@vueuse/core";
import { useDeleteAssignmentMutation } from "@/queries/assignments.ts";
import type { AssignmentsResponse } from "@/controllers/assignments";
import type { AssignmentDTO } from "@dwengo-1/common/interfaces/assignment";
import UsingQueryResult from "@/components/UsingQueryResult.vue";

const { t } = useI18n();
const router = useRouter();

const role = ref(auth.authState.activeRole);
const username = ref<string | undefined>(undefined);
const isLoading = ref(false);
const isError = ref(false);
const errorMessage = ref<string>("");

// Load current user before rendering the page
onMounted(async () => {
    isLoading.value = true;
    try {
        const userObject = await authState.loadUser();
        username.value = userObject!.profile.preferred_username;
    } catch (error) {
        isError.value = true;
        errorMessage.value = error instanceof Error ? error.message : String(error);
    } finally {
        isLoading.value = false;
    }
});

const isTeacher = computed(() => role.value === "teacher");

const assignmentsQuery = isTeacher ? useTeacherAssignmentsQuery(username, true) : useStudentAssignmentsQuery(username, true);

async function goToCreateAssignment(): Promise<void> {
    await router.push("/assignment/create");
}

async function goToAssignmentDetails(id: number, clsId: string): Promise<void> {
    await router.push(`/assignment/${clsId}/${id}`);
}

const { mutate, data, isSuccess } = useDeleteAssignmentMutation();

watch([isSuccess, data], async ([success, oldData]) => {
    if (success && oldData?.assignment) {
        window.location.reload();
    }
});

async function goToDeleteAssignment(num: number, clsId: string): Promise<void> {
    mutate({ cid: clsId, an: num });
}

onMounted(async () => {
    const user = await auth.loadUser();
    username.value = user?.profile?.preferred_username ?? "";
});
</script>

<template>
    <main>
        <h1>{{ t("assignments") }}</h1>
        <div class="loading-div" v-if="isLoading">
            <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <div v-if="isError">
            <v-empty-state icon="mdi-alert-circle-outline" :text="errorMessage"
                :title="t('error_title')"></v-empty-state>
        </div>
        <div v-else>
            <using-query-result :query-result="assignmentsQuery"
                v-slot="assignmentsResponse: { data: AssignmentsResponse }">
                <v-btn v-if="isTeacher" color="primary" class="mb-4 center-btn" @click="goToCreateAssignment">
                    {{ t("new-assignment") }}
                </v-btn>
                <v-container>
                    <v-table class="table">
                        <thead>
                            <tr>
                                <th class="header">{{ t("assignments") }}</th>
                                <th class="header">
                                    {{ t("class") }}
                                </th>
                                <th class="header">{{ t("groups") }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="a in assignmentsResponse.data.assignments as AssignmentDTO[]"
                                :key="a.id + a.within">
                                <td>
                                    <v-btn :to="`/class/${a.within}`" variant="text">
                                        {{ a.title }}
                                        <v-icon end> mdi-menu-right </v-icon>
                                    </v-btn>
                                </td>
                                <td>
                                    <span>{{ a.within }}</span>
                                    <!-- <span v-if="!isMdAndDown">{{ c.id }}</span>
                                    <span v-else style="cursor: pointer" @click="openCodeDialog(c.id)"><v-icon
                                            icon="mdi-eye"></v-icon></span> -->
                                </td>

                                <td>{{ a.groups.length }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-container>
            </using-query-result>
        </div>
            <div class="assignments-container">
                <using-query-result :query-result="assignmentsQuery"
                    v-slot="assignmentsResponse: { data: AssignmentsResponse }">
                    <v-container>
                        <v-row>
                            <v-col v-for="assignment in assignmentsResponse.data.assignments as AssignmentDTO[]"
                                :key="assignment.id + assignment.within" cols="12">
                                <v-card class="assignment-card">
                                    <div class="top-content">
                                        <div class="assignment-title">{{ assignment.title }}</div>
                                        <div class="assignment-class">
                                            {{ t("class") }}:
                                            <span class="class-name">
                                                {{ assignment.within }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="spacer"></div>

                                    <div class="button-row">
                                        <v-btn color="primary" variant="text"
                                            @click="goToAssignmentDetails(assignment.id, assignment.within)">
                                            {{ t("view-assignment") }}
                                        </v-btn>
                                        <v-btn v-if="isTeacher" color="red" variant="text"
                                            @click="goToDeleteAssignment(assignment.id, assignment.within)">
                                            {{ t("delete") }}
                                        </v-btn>
                                    </div>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </using-query-result>
            </div>
    </main>

</template>

<style scoped>
.assignments-container {
    width: 100%;
    margin: 0 auto;
    padding: 2% 4%;
    box-sizing: border-box;
}

.center-btn {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.assignment-card {
    padding: 1rem;
}

.top-content {
    margin-bottom: 1rem;
    word-break: break-word;
}

.spacer {
    flex: 1;
}

.button-row {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.assignment-title {
    font-weight: bold;
    font-size: 1.5rem;
    margin-bottom: 0.1rem;
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
</style>
