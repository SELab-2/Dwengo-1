<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import authState from "@/services/auth/auth-service.ts";
    import { computed, onMounted, ref } from "vue";
    import { useRoute } from "vue-router";
    import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
    import { useCreateJoinRequestMutation, useStudentClassesQuery } from "@/queries/students";
    import type { StudentDTO } from "@dwengo-1/common/interfaces/student";
    import type { TeacherDTO } from "@dwengo-1/common/interfaces/teacher";
    import type { ClassesResponse } from "@/controllers/classes";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { useClassStudentsQuery, useClassTeachersQuery } from "@/queries/classes";
    import type { StudentsResponse } from "@/controllers/students";
    import type { TeachersResponse } from "@/controllers/teachers";
    import "../../assets/common.css";

    const { t } = useI18n();
    const route = useRoute();

    // Username of logged in student
    const username = ref<string | undefined>(undefined);
    const isLoading = ref(false);
    const isError = ref(false);
    const errorMessage = ref<string>("");

    // Students of selected class are shown when logged in student presses on the member count
    const selectedClass = ref<ClassDTO | null>(null);
    const getStudents = ref(false);

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

        const queryCode = route.query.code as string | undefined;
        if (queryCode) {
            code.value = queryCode;
        }
    });

    // Fetch all classes of the logged in student
    const classesQuery = useStudentClassesQuery(username);
    // Fetch all students of the class
    const getStudentsQuery = useClassStudentsQuery(computed(() => selectedClass.value?.id));
    // Fetch all teachers of the class
    const getTeachersQuery = useClassTeachersQuery(computed(() => selectedClass.value?.id));

    // Boolean that handles visibility for dialogs
    // Clicking on membercount will show a dialog with all members
    const dialog = ref(false);

    // Function to display all members of a class in a dialog
    async function openStudentDialog(c: ClassDTO): Promise<void> {
        selectedClass.value = c;

        // Let the component know it should show the students in a class
        getStudents.value = true;
        await getStudentsQuery.refetch();
        dialog.value = true;
    }

    async function openTeacherDialog(c: ClassDTO): Promise<void> {
        selectedClass.value = c;

        // Let the component know it should show teachers of a class
        getStudents.value = false;
        await getTeachersQuery.refetch();
        dialog.value = true;
    }

    // Hold the code a student gives in to join a class
    const code = ref<string>("");

    // The code a student sends in to join a class needs to be formatted as v4 to be valid
    // These rules are used to display a message to the user if they use a code that has an invalid format
    function codeRegex(value: string): boolean {
        return /^[a-zA-Z0-9]{6}$/.test(value)
    }

    const codeRules = [
        (value: string | undefined): string | boolean => {
            if (value === undefined || value === "") {
                return true;
            } else if (codeRegex(value)) {
                return true;
            }
            return t("invalidFormat");
        },
    ];

    // Used to send the actual class join request
    const { mutate } = useCreateJoinRequestMutation();

    // Function called when a student submits a code to join a class
    function submitCode(): void {
        // Check if the code is valid
        if (code.value !== undefined && codeRegex(code.value)) {
            mutate(
                { username: username.value!, classId: code.value },
                {
                    onSuccess: () => {
                        showSnackbar(t("sent"), "success");
                    },
                    onError: (e) => {
                        showSnackbar(t("failed") + ": " + e.message, "error");
                    },
                },
            );
            code.value = "";
        }
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
        <div v-else>
            <h1 class="h1">{{ t("classes") }}</h1>
            <using-query-result
                :query-result="classesQuery"
                v-slot="classResponse: { data: ClassesResponse }"
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
                                        <th class="header">{{ t("classes") }}</th>
                                        <th class="header">{{ t("teachers") }}</th>
                                        <th class="header">{{ t("members") }}</th>
                                    </tr>
                                </thead>
                                <tbody v-if="classResponse.data.classes.length">
                                    <tr
                                        v-for="c in classResponse.data.classes as ClassDTO[]"
                                        :key="c.id"
                                    >
                                        <td>{{ c.displayName }}</td>
                                        <td
                                            class="link"
                                            @click="openTeacherDialog(c)"
                                        >
                                            {{ c.teachers.length }}
                                        </td>
                                        <td
                                            class="link"
                                            @click="openStudentDialog(c)"
                                        >
                                            {{ c.students.length }}
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr>
                                        <td
                                            colspan="3"
                                            class="empty-message"
                                        >
                                            <v-icon
                                                icon="mdi-information-outline"
                                                size="small"
                                            >
                                            </v-icon>
                                            {{ t("no-classes-found") }}
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row>
                </v-container>
            </using-query-result>

            <v-dialog
                v-if="selectedClass"
                v-model="dialog"
                width="400"
            >
                <v-card>
                    <v-card-title> {{ selectedClass!.displayName }} </v-card-title>
                    <v-card-text>
                        <ul v-if="getStudents">
                            <using-query-result
                                :query-result="getStudentsQuery"
                                v-slot="studentsResponse: { data: StudentsResponse }"
                            >
                                <li
                                    v-for="student in studentsResponse.data.students as StudentDTO[]"
                                    :key="student.username"
                                >
                                    {{ student.firstName + " " + student.lastName }}
                                </li>
                            </using-query-result>
                        </ul>
                        <ul v-else>
                            <using-query-result
                                :query-result="getTeachersQuery"
                                v-slot="teachersResponse: { data: TeachersResponse }"
                            >
                                <li
                                    v-for="teacher in teachersResponse.data.teachers as TeacherDTO[]"
                                    :key="teacher.username"
                                >
                                    {{ teacher.firstName + " " + teacher.lastName }}
                                </li>
                            </using-query-result>
                        </ul>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            color="primary"
                            @click="dialog = false"
                            >{{ t("close") }}</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <div>
                <div class="join">
                    <h2>{{ t("joinClass") }}</h2>
                    <p>{{ t("JoinClassExplanation") }}</p>

                    <v-sheet
                        class="pa-4 sheet"
                        max-width="400"
                    >
                        <v-form @submit.prevent>
                            <v-text-field
                                label="CODE"
                                v-model="code"
                                placeholder="XXXXXX"
                                :rules="codeRules"
                                variant="outlined"
                            ></v-text-field>
                            <v-btn
                                class="mt-4"
                                color="#f6faf2"
                                type="submit"
                                @click="submitCode"
                                block
                                >{{ t("submitCode") }}</v-btn
                            >
                        </v-form>
                    </v-sheet>
                </div>
            </div>
        </div>
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
    h2 {
        color: #0e6942;
        font-size: 30px;
    }

    .join {
        display: flex;
        margin-left: 1%;
        flex-direction: column;
        gap: 20px;
        margin-top: 50px;
    }

    .link {
        color: #0b75bb;
        text-decoration: underline;
    }

    @media screen and (max-width: 800px) {
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
