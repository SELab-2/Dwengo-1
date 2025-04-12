<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import authState from "@/services/auth/auth-service.ts";
    import { onMounted, ref } from "vue";
    import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
    import { useRoute } from "vue-router";
    import { ClassController, type ClassResponse } from "@/controllers/classes";
    import type { JoinRequestResponse, JoinRequestsResponse, StudentsResponse } from "@/controllers/students";
    import type { StudentDTO } from "@dwengo-1/common/interfaces/student";
    import { useStudentJoinRequestQuery } from "@/queries/students";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { useTeacherJoinRequestsQuery, useUpdateJoinRequestMutation } from "@/queries/teachers";
    import type { ClassJoinRequestDTO } from "@dwengo-1/common/interfaces/class-join-request";

    const { t } = useI18n();

    // Username of logged in teacher
    const username = ref<string | undefined>(undefined);
    const classController: ClassController = new ClassController();

    // Find class id from route
    const route = useRoute();
    const classId: string = route.params.id as string;

    const isLoading = ref(true);
    const currentClass = ref<ClassDTO | undefined>(undefined);
    const students = ref<StudentDTO[]>([]);

    const joinRequestsQuery = useTeacherJoinRequestsQuery(username, classId);
    const { mutate } = useUpdateJoinRequestMutation();

    // Find the username of the logged in user so it can be used to fetch other information
    // When loading the page
    onMounted(async () => {
        const userObject = await authState.loadUser();
        username.value = userObject?.profile?.preferred_username ?? undefined;

        // Get class of which information should be shown
        const classResponse: ClassResponse = await classController.getById(classId);
        if (classResponse && classResponse.class) {
            currentClass.value = classResponse.class;
            isLoading.value = false;
        }

        // Fetch all students of the class
        const studentsResponse: StudentsResponse = await classController.getStudents(classId);
        if (studentsResponse && studentsResponse.students) students.value = studentsResponse.students as StudentDTO[];
    });

    // TODO: Boolean that handles visibility for dialogs
    // Popup to verify removing student
    const dialog = ref(false);
    const selectedStudent = ref<StudentDTO | null>(null);

    function showPopup(s: StudentDTO): void {
        selectedStudent.value = s;
        dialog.value = true;
    }

    // Remove student from class
    async function removeStudentFromclass(): Promise<void> {
        // TODO: replace by query
        if (selectedStudent.value) await classController.deleteStudent(classId, selectedStudent.value.username);
        dialog.value = false;

        selectedStudent.value = null;
        //TODO when query; reload table so student not longer in table
    }

    function handleJoinRequest(c: ClassJoinRequestDTO, accepted: boolean) {
        mutate(
            {
                teacherUsername: username.value!,
                studentUsername: c.requester.username,
                classId: c.class,
                accepted: accepted,
            },
            {
                onSuccess: () => {
                    showSnackbar(t("sent"), "success");
                },
                onError: (e) => {
                    // showSnackbar(t("failed") + ": " + e.message, "error");
                    throw e;
                },
            },
        );
    }
    const snackbar = ref({
        visible: false,
        message: "",
        color: "success",
    });

    function showSnackbar(message: string, color: string): void {
        snackbar.value.message = message;
        snackbar.value.color = color;
        snackbar.value.visible = true;
    }
</script>
<template>
    <main>
        <div
            v-if="isLoading"
            class="text-center py-10"
        >
            <v-progress-circular
                indeterminate
                color="primary"
            />
            <p>Loading...</p>
        </div>
        <div v-else>
            <h1 class="title">{{ currentClass!.displayName }}</h1>
            <v-container
                fluid
                class="ma-4"
            >
                <v-row
                    no-gutters
                    fluid
                >
                    <v-col
                        cols="12"
                        sm="6"
                        md="6"
                    >
                        <v-table class="table">
                            <thead>
                                <tr>
                                    <th class="header">{{ t("students") }}</th>
                                    <th class="header"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="s in students"
                                    :key="s.id"
                                >
                                    <td>
                                        {{ s.firstName + " " + s.lastName }}
                                    </td>
                                    <td>
                                        <v-btn @click="showPopup(s)"> {{ t("remove") }} </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                    <using-query-result
                        :query-result="joinRequestsQuery"
                        v-slot="joinRequests: { data: JoinRequestsResponse }"
                    >
                        <v-col
                            cols="12"
                            sm="6"
                            md="6"
                        >
                            <v-table class="table">
                                <thead>
                                    <tr>
                                        <th class="header">{{ t("classJoinRequests") }}</th>
                                        <th class="header">{{ t("accept") + "/" + t("reject") }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="jr in joinRequests.data.joinRequests as ClassJoinRequestDTO[]"
                                        :key="(jr.class, jr.requester, jr.status)"
                                    >
                                        <td>
                                            {{ jr.requester.firstName + " " + jr.requester.lastName }}
                                        </td>
                                        <td>
                                            <v-btn
                                                @click="handleJoinRequest(jr, true)"
                                                class="mr-2"
                                                color="green"
                                            >
                                                {{ t("accept") }}</v-btn
                                            >

                                            <v-btn
                                                @click="handleJoinRequest(jr, false)"
                                                class="mr-2"
                                                color="red"
                                            >
                                                {{ t("reject") }}
                                            </v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </using-query-result>
                </v-row>
            </v-container>
        </div>
        <v-dialog
            v-model="dialog"
            max-width="400px"
        >
            <v-card>
                <v-card-title class="headline">{{ t("areusure") }}</v-card-title>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        @click="dialog = false"
                    >
                        {{ t("cancel") }}
                    </v-btn>
                    <v-btn
                        text
                        @click="removeStudentFromclass"
                        >{{ t("yes") }}</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar
            v-model="snackbar.visible"
            :color="snackbar.color"
            timeout="3000"
        >
            {{ snackbar.message }}
        </v-snackbar>
    </main>
</template>
<style scoped>
    .header {
        font-weight: bold !important;
        background-color: #0e6942;
        color: white;
        padding: 10px;
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

    @media screen and (max-width: 800px) {
        h1 {
            text-align: center;
            padding-left: 0;
        }

        .join {
            text-align: center;
            align-items: center;
            margin-left: 0;
        }

        .sheet {
            width: 100%;
        }

        main {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 5px;
        }
    }
</style>
