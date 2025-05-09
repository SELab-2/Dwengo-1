<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import authState from "@/services/auth/auth-service.ts";
    import { onMounted, ref, watchEffect } from "vue";
    import { useRoute } from "vue-router";
    import type { ClassResponse } from "@/controllers/classes";
    import type { JoinRequestsResponse, StudentsResponse } from "@/controllers/students";
    import type { StudentDTO } from "@dwengo-1/common/interfaces/student";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { useTeacherJoinRequestsQuery, useUpdateJoinRequestMutation } from "@/queries/teachers";
    import type { ClassJoinRequestDTO } from "@dwengo-1/common/interfaces/class-join-request";
    import { useClassDeleteStudentMutation, useClassQuery, useClassStudentsQuery } from "@/queries/classes";
    import { useCreateTeacherInvitationMutation } from "@/queries/teacher-invitations";
    import type { TeacherInvitationData } from "@dwengo-1/common/interfaces/teacher-invitation";
    import { useDisplay } from "vuetify";

    const { t } = useI18n();

    const route = useRoute();
    const classId: string = route.params.id as string;
    const username = ref<string | undefined>(undefined);
    const isLoading = ref(false);
    const isError = ref(false);
    const errorMessage = ref<string>("");
    const usernameTeacher = ref<string | undefined>(undefined);

    // Queries used to access the backend and catch loading or errors

    // Gets the class a teacher wants to manage
    const getClass = useClassQuery(classId);
    // Get all students part of the class
    const getStudents = useClassStudentsQuery(classId);
    // Get all join requests for this class
    const joinRequestsQuery = useTeacherJoinRequestsQuery(username, classId);
    // Handle accepting or rejecting join requests
    const { mutate } = useUpdateJoinRequestMutation();
    // Handle deletion of a student from the class
    const { mutate: deleteStudentMutation } = useClassDeleteStudentMutation();
    // Handle creation of teacher invites
    const { mutate: sentInviteMutation } = useCreateTeacherInvitationMutation();

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

    // Used to set the visibility of the dialog
    const dialog = ref(false);
    // Student selected for deletion
    const selectedStudent = ref<StudentDTO | null>(null);

    // Let the teacher verify deletion of a student
    function showPopup(s: StudentDTO): void {
        selectedStudent.value = s;
        dialog.value = true;
    }

    async function removeStudentFromclass(): Promise<void> {
        // Delete student from class
        deleteStudentMutation(
            { id: classId, username: selectedStudent.value!.username },
            {
                onSuccess: async () => {
                    dialog.value = false;
                    await getStudents.refetch();
                    showSnackbar(t("success"), "success");
                },
                onError: (e) => {
                    dialog.value = false;
                    showSnackbar(t("failed") + ": " + e.response.data.error || e.message, "error");
                },
            },
        );
    }

    function handleJoinRequest(c: ClassJoinRequestDTO, accepted: boolean): void {
        // Handle acception or rejection of a join request
        mutate(
            {
                teacherUsername: username.value!,
                studentUsername: c.requester.username,
                classId: c.class,
                accepted: accepted,
            },
            {
                onSuccess: async () => {
                    if (accepted) {
                        await joinRequestsQuery.refetch();
                        await getStudents.refetch();

                        showSnackbar(t("accepted"), "success");
                    } else {
                        await joinRequestsQuery.refetch();
                        showSnackbar(t("rejected"), "success");
                    }
                },
                onError: (e) => {
                    showSnackbar(t("failed") + ": " + e.response.data.error || e.message, "error");
                },
            },
        );
    }

    function sentInvite(): void {
        if (!usernameTeacher.value) {
            showSnackbar(t("please enter a valid username"), "error");
            return;
        }
        const data: TeacherInvitationData = {
            sender: username.value!,
            receiver: usernameTeacher.value,
            class: classId,
        };
        sentInviteMutation(data, {
            onSuccess: () => {
                usernameTeacher.value = "";
            },
            onError: (e) => {
                console.log("error", e);
                console.log(e.response.data.error);
                showSnackbar(t("failed") + ": " + e.response.data.error || e.message, "error");
            },
        });
    }

    // Default of snackbar values
    const snackbar = ref({
        visible: false,
        message: "",
        color: "success",
    });

    // Function to show snackbar on success or failure
    function showSnackbar(message: string, color: string): void {
        snackbar.value.message = message;
        snackbar.value.color = color;
        snackbar.value.visible = true;
    }

    // Custom breakpoints
    const customBreakpoints = {
        xs: 0,
        sm: 500,
        md: 1370,
        lg: 1400,
        xl: 1600,
    };

    // Logic for small screens
    const display = useDisplay();

    // Reactive variables to hold custom logic based on breakpoints
    const isSmAndDown = ref(false);
    const isMdAndDown = ref(false);

    watchEffect(() => {
        // Custom breakpoint logic
        isSmAndDown.value = display.width.value < customBreakpoints.sm;
        isMdAndDown.value = display.width.value < customBreakpoints.md;
    });
</script>
<template>
    <main>
        <div
            class="loading-div"
            v-if="isLoading"
        >
            <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <div v-if="isError">
            <v-empty-state
                icon="mdi-alert-circle-outline"
                :text="errorMessage"
                :title="t('error_title')"
            ></v-empty-state>
        </div>
        <using-query-result
            :query-result="getClass"
            v-slot="classResponse: { data: ClassResponse }"
        >
            <div>
                <h1 class="title">{{ classResponse.data.class.displayName }}</h1>
                <using-query-result
                    :query-result="getStudents"
                    v-slot="studentsResponse: { data: StudentsResponse }"
                >
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
                                            v-for="s in studentsResponse.data.students as StudentDTO[]"
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
                                                    <span v-if="!isSmAndDown && !isMdAndDown">
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
                                                    </span>
                                                    <span v-else>
                                                        <v-btn
                                                            @click="handleJoinRequest(jr, true)"
                                                            icon="mdi-check-circle"
                                                            class="mr-2"
                                                            color="green"
                                                            variant="text"
                                                        ></v-btn>
                                                        <v-btn
                                                            @click="handleJoinRequest(jr, false)"
                                                            icon="mdi-close-circle"
                                                            class="mr-2"
                                                            color="red"
                                                            variant="text"
                                                        ></v-btn>
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-col>
                            </using-query-result>
                        </v-row>
                    </v-container>
                </using-query-result>
            </div>
            <div>
                <div class="join">
                    <h2>{{ t("invitations") }}</h2>
                    <p>{{ t("enterUsername") }}</p>

                    <v-sheet
                        class="pa-4 sheet"
                        max-width="400"
                    >
                        <v-form @submit.prevent>
                            <v-text-field
                                :label="`${t('username')}`"
                                v-model="usernameTeacher"
                                :placeholder="`${t('username')}`"
                                variant="outlined"
                            ></v-text-field>
                            <v-btn
                                class="mt-4"
                                color="#f6faf2"
                                type="submit"
                                @click="sentInvite"
                                block
                                >{{ t("invite") }}</v-btn
                            >
                        </v-form>
                    </v-sheet>
                </div>
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
        </using-query-result>
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
