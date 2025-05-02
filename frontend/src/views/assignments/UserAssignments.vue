<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import authState from "@/services/auth/auth-service.ts";
import auth from "@/services/auth/auth-service.ts";
import { useTeacherAssignmentsQuery, useTeacherClassesQuery } from "@/queries/teachers.ts";
import { useStudentAssignmentsQuery, useStudentClassesQuery } from "@/queries/students.ts";
import { ClassController, type ClassesResponse } from "@/controllers/classes.ts";
import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
import { asyncComputed } from "@vueuse/core";
import { useCreateAssignmentMutation, useDeleteAssignmentMutation } from "@/queries/assignments.ts";
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
const { mutate: assignmentMutation, isSuccess: assignmentIsSuccess } = useCreateAssignmentMutation();

const classesQuery = isTeacher ? useTeacherClassesQuery(username, true) : useStudentClassesQuery(username, true);
const selectedClass = ref<ClassDTO | undefined>(undefined);
const isClassSelected = ref(false);

const assignmentTitle = ref<string>("");

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

async function createAssignment(): Promise<void> {
    const cid = selectedClass.value!.id;
    const assignmentData: Partial<AssignmentDTO> = {
        within: cid,
        title: assignmentTitle.value!,
    };

    assignmentMutation({ cid: cid, data: assignmentData}, {
        onSuccess: async (classResponse) => {
            // showSnackbar(t("classCreated"), "success");
            // const createdClass: ClassDTO = classResponse.class;
            // code.value = createdClass.id;
            await assignmentsQuery.refetch();
        },
        onError: (err) => {
            console.log(err);
            // showSnackbar(t("creationFailed") + ": " + err.message, "error");
        },
    });
}
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
                <v-container fluid class="ma-4">
                    <v-row no-gutters class="custom-breakpoint">
                        <v-col cols="12" sm="6" md="6" class="responsive-col">
                            <v-table class="table">
                                <thead>
                                    <tr>
                                        <th class="header">{{ t("assignment") }}</th>
                                        <th class="header">
                                            {{ t("progress") }}
                                        </th>
                                        <th class="header">{{ t("deadline") }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="a in assignmentsResponse.data.assignments as AssignmentDTO[]"
                                        :key="a.id + a.within">
                                        <td>
                                            <v-btn :to="`/assignment/${a.within}/${a.id}`" variant="text">
                                                {{ a.title }}
                                                <v-icon end> mdi-menu-right </v-icon>
                                            </v-btn>
                                        </td>
                                        <td>
                                            <v-progress-linear :model-value="0" color="blue-grey" height="25">
                                                <template v-slot:default="{ value }">
                                                    <strong>{{ Math.ceil(value) }}%</strong>
                                                </template>
                                            </v-progress-linear>
                                        </td>
                                        <td>Nov 9, 2025, 06:00 PM EST+1</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" class="responsive-col">
                            <div>
                                <h2>{{ t("createAssignment") }}</h2>

                                <v-sheet class="pa-4 sheet" max-width="600px">
                                    <p>{{ t("createClassInstructions") }}</p>
                                    <v-form @submit.prevent>
                                        <v-text-field class="mt-4" :label="`${t('title')}`" v-model="assignmentTitle"
                                            :placeholder="`${t('EnterAssignmentTitle')}`"
                                            variant="outlined"></v-text-field>
                                        <using-query-result :query-result="classesQuery"
                                            v-slot="{ data }: { data: ClassesResponse }">
                                            <v-card-text class="mt-4">
                                                <v-combobox class="mt-4" v-model="selectedClass" 
                                                    :items="data.classes"
                                                    :label="t('choose-class')"
                                                    variant="outlined" 
                                                    clearable 
                                                    hide-details 
                                                    density="compact"
                                                    append-inner-icon="mdi-magnify" 
                                                    item-title="displayName"
                                                    item-value="id" 
                                                    required 
                                                    :disabled="isClassSelected" 
                                                    :filter="(item: ClassDTO, query: string) => item.displayName.toLowerCase().includes(query.toLowerCase())"
                                                >
                                                </v-combobox>
                                            </v-card-text>
                                        </using-query-result>
                                        <v-btn class="mt-4" color="#f6faf2" type="submit" @click="createAssignment" block>
                                            {{ t("create")}}
                                        </v-btn>
                                    </v-form>
                                </v-sheet>
                            </div>
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

.header {
    font-weight: bold !important;
    background-color: #0e6942;
    color: white;
    padding: 10px;
}

h1 {
    color: #0e6942;
    text-transform: uppercase;
    font-weight: bolder;
    padding-top: 2%;
    font-size: 50px;
}

h2 {
    color: #0e6942;
    font-size: 30px;
}

.join {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 50px;
}

.link {
    color: #0b75bb;
    text-decoration: underline;
}

main {
    margin-left: 30px;
}

td,
th {
    border-bottom: 1px solid #0e6942;
    border-top: 1px solid #0e6942;
}

.table {
    width: 90%;
    padding-top: 10px;
    border-collapse: collapse;
}

table thead th:first-child {
    border-top-left-radius: 10px;
}

.table thead th:last-child {
    border-top-right-radius: 10px;
}

.table tbody tr:nth-child(odd) {
    background-color: white;
}

.table tbody tr:nth-child(even) {
    background-color: #f6faf2;
}
</style>
