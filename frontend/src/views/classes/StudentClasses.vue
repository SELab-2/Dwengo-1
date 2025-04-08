<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import authState from "@/services/auth/auth-service.ts";
    import { computed, onMounted, ref, type ComputedRef } from "vue";
    import { validate, version } from "uuid";
    import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
    import { useCreateJoinRequestMutation, useStudentClassesQuery } from "@/queries/students";
    import type { StudentDTO } from "@dwengo-1/common/interfaces/student";
    import { StudentController } from "@/controllers/students";
    import type { TeacherDTO } from "@dwengo-1/common/interfaces/teacher";
    import { TeacherController } from "@/controllers/teachers";

    const { t } = useI18n();
    const studentController: StudentController = new StudentController();
    const teacherController: TeacherController = new TeacherController();

    // Username of logged in student
    const username = ref<string | undefined>(undefined);

    // Find the username of the logged in user so it can be used to fetch other information
    // When loading the page
    onMounted(async () => {
        const userObject = await authState.loadUser();
        username.value = userObject?.profile?.preferred_username ?? undefined;
    });

    // Fetch all classes of the logged in student
    const { data: classesResponse, isLoading, error } = useStudentClassesQuery(username);

    // Empty list when classes are not yet loaded, else the list of classes of the user
    const classes: ComputedRef<ClassDTO[]> = computed(() => {
        // The classes are not yet fetched
        if (!classesResponse.value) {
            return [];
        }
        // The user has no classes
        if (classesResponse.value.classes.length === 0) {
            return [];
        }
        return classesResponse.value.classes as ClassDTO[];
    });

    // Students of selected class are shown when logged in student presses on the member count
    const selectedClass = ref<ClassDTO | null>(null);
    const students = ref<StudentDTO[]>([]);
    const teachers = ref<TeacherDTO[]>([]);
    const getStudents = ref(false);

    // Boolean that handles visibility for dialogs
    // Clicking on membercount will show a dialog with all members
    const dialog = ref(false);

    // Function to display all members of a class in a dialog
    async function openStudentDialog(c: ClassDTO): Promise<void> {
        selectedClass.value = c;

        // Clear previous value
        getStudents.value = true;
        students.value = [];
        dialog.value = true;

        // Fetch students from their usernames to display their full names
        const studentDTOs: (StudentDTO | null)[] = await Promise.all(
            c.students.map(async (uid) => {
                try {
                    const res = await studentController.getByUsername(uid);
                    return res.student;
                } catch (_) {
                    return null;
                }
            }),
        );

        // Only show students that are not fetched ass *null*
        students.value = studentDTOs.filter(Boolean) as StudentDTO[];
    }

    async function openTeacherDialog(c: ClassDTO): Promise<void> {
        selectedClass.value = c;

        // Clear previous value
        getStudents.value = false;
        teachers.value = [];
        dialog.value = true;

        // Fetch names of teachers
        const teacherDTOs: (TeacherDTO | null)[] = await Promise.all(
            c.teachers.map(async (uid) => {
                try {
                    const res = await teacherController.getByUsername(uid);
                    return res.teacher;
                } catch (_) {
                    return null;
                }
            }),
        );

        teachers.value = teacherDTOs.filter(Boolean) as TeacherDTO[];
    }

    // Hold the code a student gives in to join a class
    const code = ref<string>("");

    // The code a student sends in to join a class needs to be formatted as v4 to be valid
    // These rules are used to display a message to the user if they use a code that has an invalid format
    const codeRules = [
        (value: string | undefined): string | boolean => {
            if (value === undefined || value === "") {
                return true;
            } else if (value !== undefined && validate(value) && version(value) === 4) {
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
        if (code.value !== undefined && validate(code.value) && version(code.value) === 4) {
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
            v-if="isLoading"
            class="text-center py-10"
        >
            <v-progress-circular
                indeterminate
                color="primary"
            />
            <p>Loading...</p>
        </div>

        <div
            v-else-if="error"
            class="text-center py-10 text-error"
        >
            <v-icon large>mdi-alert-circle</v-icon>
            <p>Error loading: {{ error.message }}</p>
        </div>
        <div v-else>
            <h1 class="title">{{ t("classes") }}</h1>
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
                            <tbody>
                                <tr
                                    v-for="c in classes"
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
                        </v-table>
                    </v-col>
                </v-row>
            </v-container>

            <v-dialog
                v-model="dialog"
                width="400"
            >
                <v-card>
                    <v-card-title> {{ selectedClass?.displayName }} </v-card-title>
                    <v-card-text>
                        <ul v-if="getStudents">
                            <li
                                v-for="student in students"
                                :key="student.username"
                            >
                                {{ student.firstName + " " + student.lastName }}
                            </li>
                        </ul>
                        <ul v-else>
                            <li
                                v-for="teacher in teachers"
                                :key="teacher.username"
                            >
                                {{ teacher.firstName + " " + teacher.lastName }}
                            </li>
                        </ul>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            color="primary"
                            @click="dialog = false"
                            >Close</v-btn
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
                                placeholder="XXXXXXXX-XXXX-4XXX-XXXX-XXXXXXXXXXXX"
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
