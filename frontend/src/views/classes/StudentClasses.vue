<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import authState from "@/services/auth/auth-service.ts";
    import { computed, onMounted, ref, type ComputedRef } from "vue";
    import { validate, version } from "uuid";
    import type { TeacherDTO } from "@dwengo-1/common/interfaces/teacher";
    import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
    import { useCreateJoinRequestMutation, useStudentClassesQuery } from "@/queries/students";
    import type { StudentDTO } from "@dwengo-1/common/interfaces/student";
    import { StudentController } from "@/controllers/students";

    const { t } = useI18n();
    const studentController: StudentController = new StudentController();

    // username of logged in student
    const username = ref<string | undefined>(undefined);

    // find the username of the logged in user so it can be used to fetch other information
    // when loading the page
    onMounted(async () => {
        const userObject = await authState.loadUser();
        username.value = userObject?.profile?.preferred_username ?? undefined;
    });

    // fetch all classes of the logged in student
    const { data: classesResponse, isLoading, error } = useStudentClassesQuery(username);

    // empty list when classes are not yet loaded, else the list of classes of the user
    const classes: ComputedRef<ClassDTO[]> = computed(() => {
        // the classes are not yet fetched
        if (!classesResponse.value) {
            return [];
        }
        // the user has no classes
        if (classesResponse.value.classes.length === 0) {
            return [];
        }
        if (typeof classesResponse.value.classes[0] === "string") {
            // should not occur because value of *full* is true
            // must be caught because typescript can't know the type
            // i chose to return an empty list if this occurs
            // it is also possible to fetch all classes from the id's returned
            return [];
        }
        return classesResponse.value.classes as ClassDTO[];
    });

    // students of selected class are shown when logged in student presses on the member count
    const selectedClass = ref<ClassDTO | null>(null);
    const students = ref<StudentDTO[]>([]);

    // Boolean that handles visibility for dialogs
    // clicking on membercount will show a dialog with all members
    const dialog = ref(false);

    // Function to display all members of a class in a dialog
    async function openDialog(c: ClassDTO) {
        selectedClass.value = c;

        // Clear previous value
        students.value = [];
        dialog.value = true;

        // fetch students from their usernames to display their full names
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

        // only show students that are not fetched ass *null*
        students.value = studentDTOs.filter(Boolean) as StudentDTO[];
    }

    // hold the code a student gives in to join a class
    const code = ref<string>("");

    // The code a student sends in to join a class needs to be formatted as v4 to be valid
    // These rules are used to display a message to the user if they use a code that has an invalid format
    const codeRules = [
        (value: string | undefined): string | boolean => {
            if (value !== undefined && validate(value) && version(value) === 4) return true;
            return t("invalidFormat");
        },
    ];

    // used to send the actual class join request
    const { mutate, isError } = useCreateJoinRequestMutation();

    // Function called when a student submits a code to join a class
    function submitCode() {
        // Check if the code is valid
        if (code.value !== undefined && validate(code.value) && version(code.value) === 4) {
            // TODO: uncomment when fixed
            // mutate( { username : username.value! , classId : code.value });

            console.log("Code submitted:", code.value);
        }
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
                                        @click="openDialog(c)"
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
                        <ul>
                            <li
                                v-for="student in students"
                                :key="student.username"
                            >
                                {{ student.firstName + " " + student.lastName }}
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
