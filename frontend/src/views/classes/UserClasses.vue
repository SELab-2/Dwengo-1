<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import authState from "@/services/auth/auth-service.ts";
    import { computed, onMounted, ref, watch, watchEffect, type ComputedRef } from "vue";
    import { validate, version } from "uuid";
    import type { TeacherDTO } from "@dwengo-1/common/interfaces/teacher";
    import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
    import { useStudentClassesQuery, useStudentQuery } from "@/queries/students";
    import type { StudentDTO } from "@dwengo-1/common/interfaces/student";
    import { StudentController } from "@/controllers/students";

    const { t } = useI18n();
    const studentController: StudentController = new StudentController();

    type Invitation = {
        id: string;
        class: ClassDTO;
        sender: TeacherDTO;
        receiver: TeacherDTO;
    };

    const classes: ComputedRef<ClassDTO[]> = computed(() => {
        const response = classesResponse.value;
        let result: ClassDTO[] = [];
        if (!classesResponse.value) {
            return result;
        } else {
            if (classesResponse.value.classes.length === 0) {
                return result;
            }
            if (typeof classesResponse.value.classes[0] === "string") {
                for (const classid of classesResponse.value.classes) {
                    // TODO when class queries are ready
                }
                return result;
            }
            return classesResponse.value.classes as ClassDTO[];
        }
    });

    const username = ref<string | undefined>(undefined);

    const { data: classesResponse, isLoading, error } = useStudentClassesQuery(username);

    onMounted(async () => {
        const userObject = await authState.loadUser();
        username.value = userObject?.profile?.preferred_username ?? undefined;
    });

    // get role of user
    const role: string = authState.authState.activeRole!;

    // TODO: change to DTO
    const invitations = ref<Array<Invitation>>([]);

    // For students: code that they give in when sending a class join request
    // For teachers: code that they get when they create a new class
    const code = ref<string>("");

    // The code a student sends in to join a class needs to be formatted as v4 to be valid
    // These rules are used to display a message to the user if they use a code that has an invalid format
    const codeRules = [
        (value: string | undefined) => {
            if (value !== undefined && validate(value) && version(value) === 4) return true;
            return t("invalidFormat");
        },
    ];

    // function called when a student submits a code to join a class
    function submitCode() {
        // check if the code is valid
        if (code.value !== undefined && validate(code.value) && version(code.value) === 4) {
            // TODO: temp function that does not use the backend
            console.log("Code submitted:", code.value);
        }
    }

    // Boolean that handles visibility for dialogs
    // For students: clicking on membercount will show a dialog with all members
    // For teachers: creating a class will generate a popup with the generated code
    const dialog = ref(false);

    // list of students in the selected class
    const students = ref<Array<StudentDTO>>([]);

    // selected class itself
    const selectedClass = ref<ClassDTO | null>(null);

    // function to display all members of a class
    async function openDialog(c: ClassDTO) {
        selectedClass.value = c;

        // clear previous value
        students.value = [];
        dialog.value = true;

        const studentDTOs: (StudentDTO | null)[] = await Promise.all(
            c.students.map(async (uid) => {
                try {
                    const res = await studentController.getByUsername(uid);
                    return res.student;
                } catch (e) {
                    return null;
                }
            }),
        );
        students.value = studentDTOs.filter(Boolean) as StudentDTO[];
    }

    // function to handle a accepted invitation request
    function acceptRequest() {
        //TODO
        console.log("request accepted");
    }

    // function to handle a denied invitation request
    function denyRequest() {
        //TODO
        console.log("request denied");
    }

    // catch the value a teacher inserts when making a class
    const className = ref<string>("");

    // The name can only contain dash, underscore letters and numbers
    // These rules are used to display a message to the user if the name is not valid
    const nameRules = [
        (value: string | undefined) => {
            if (value) return true;
            return t("nameIsMandatory");
        },
        (value: string | undefined) => {
            if (value && /^[a-zA-Z0-9_-]+$/.test(value)) return true;
            return t("onlyUse");
        },
    ];

    // function called when a teacher creates a class
    function createClass() {
        // check if the class name is valid
        if (className && className.value.length > 0 && /^[a-zA-Z0-9_-]+$/.test(className.value)) {
            //TODO
            console.log("created class with name: " + className.value);

            // show the generated code to share with the class
            dialog.value = true;
            code.value = "04c7c759-c41e-4ea9-968a-1e2a987ce0ed";
        }
    }

    // if the unique code is copied, set this to true so it's being displayed for the user
    const copied = ref(false);

    // copy the generated code to the clipboard
    function copyToClipboard() {
        navigator.clipboard.writeText(code.value);
        copied.value = true;
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
                                    <th
                                        class="header"
                                        v-if="role === 'teacher'"
                                    >
                                        {{ t("code") }}
                                    </th>
                                    <th class="header">{{ t("members") }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="c in classes"
                                    :key="c.id"
                                >
                                    <td v-if="role === 'student'">{{ c.displayName }}</td>
                                    <td v-else>
                                        <v-btn
                                            :to="`/user/class/${c.id}`"
                                            variant="text"
                                        >
                                            {{ c.displayName }}
                                            <v-icon end> mdi-menu-right </v-icon>
                                        </v-btn>
                                    </td>
                                    <td v-if="role === 'teacher'">{{ c.id }}</td>
                                    <td
                                        v-if="role === 'student'"
                                        class="link"
                                        @click="openDialog(c)"
                                    >
                                        {{ c.students.length }}
                                    </td>
                                    <td v-else>{{ c.students.length }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="6"
                    >
                        <div v-if="role === 'teacher'">
                            <h2>{{ t("createClass") }}</h2>

                            <v-sheet
                                class="pa-4 sheet"
                                max-width="600px"
                            >
                                <p>{{ t("createClassInstructions") }}</p>
                                <v-form @submit.prevent>
                                    <v-text-field
                                        class="mt-4"
                                        :label="`${t('classname')}`"
                                        v-model="className"
                                        :placeholder="`${t('EnterNameOfClass')}`"
                                        :rules="nameRules"
                                        variant="outlined"
                                    ></v-text-field>
                                    <v-btn
                                        class="mt-4"
                                        color="#f6faf2"
                                        type="submit"
                                        @click="createClass"
                                        block
                                        >{{ t("create") }}</v-btn
                                    >
                                </v-form>
                            </v-sheet>
                            <v-container>
                                <v-dialog
                                    v-model="dialog"
                                    max-width="400px"
                                >
                                    <v-card>
                                        <v-card-title class="headline">code</v-card-title>
                                        <v-card-text>
                                            <v-text-field
                                                v-model="code"
                                                readonly
                                                append-inner-icon="mdi-content-copy"
                                                @click:append-inner="copyToClipboard"
                                            ></v-text-field>
                                            <v-slide-y-transition>
                                                <div
                                                    v-if="copied"
                                                    class="text-center mt-2"
                                                >
                                                    {{ t("copied") }}
                                                </div>
                                            </v-slide-y-transition>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                text
                                                @click="
                                                    dialog = false;
                                                    copied = false;
                                                "
                                            >
                                                {{ t("close") }}
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-container>
                        </div>
                    </v-col>
                </v-row>
            </v-container>

            <h1
                v-if="role === 'teacher'"
                class="title"
            >
                {{ t("invitations") }}
            </h1>
            <v-table
                v-if="role === 'teacher'"
                class="table"
            >
                <thead>
                    <tr>
                        <th class="header">{{ t("class") }}</th>
                        <th class="header">{{ t("sender") }}</th>
                        <th class="header"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="i in invitations"
                        :key="i.id"
                    >
                        <td>
                            {{ i.class.displayName }}
                        </td>
                        <td>{{ i.sender.firstName + " " + i.sender.lastName }}</td>
                        <td class="text-right">
                            <div>
                                <v-btn
                                    color="green"
                                    @click="acceptRequest"
                                    class="mr-2"
                                >
                                    {{ t("accept") }}
                                </v-btn>
                                <v-btn
                                    color="red"
                                    @click="denyRequest"
                                >
                                    {{ t("deny") }}
                                </v-btn>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>

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
            <div v-if="role === 'student'">
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
