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

    // TODO: remove and use correct type
    interface Invitation {
        id: string;
        class: ClassDTO;
        sender: TeacherDTO;
        receiver: TeacherDTO;
    }

    // determine if role is student or teacher to render correct view
    const role: string = authState.authState.activeRole!;

    // username of logged in student or teacher
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
    // For students: clicking on membercount will show a dialog with all members
    // For teachers: creating a class will generate a popup with the generated code
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

    // For students: code that they give in when sending a class join request
    // For teachers: code that they get when they create a new class
    const code = ref<string>("");

    // The code a student sends in to join a class needs to be formatted as v4 to be valid
    // These rules are used to display a message to the user if they use a code that has an invalid format
    const codeRules = [
        (value: string | undefined) : string | boolean => {
            if (value !== undefined && validate(value) && version(value) === 4) return true;
            return t("invalidFormat");
        },
    ];

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

    // TODO: implement correctly
    const invitations = ref<Invitation[]>([]);

    // Function to handle a accepted invitation request
    function acceptRequest() {
        //TODO
        console.log("request accepted");
    }

    // Function to handle a denied invitation request
    function denyRequest() {
        //TODO
        console.log("request denied");
    }

    // teacher should be able to set a displayname when making a class
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

    // Function called when a teacher creates a class
    function createClass() {
        // Check if the class name is valid
        if (className.value && className.value.length > 0 && /^[a-zA-Z0-9_-]+$/.test(className.value)) {
            //TODO
            console.log("created class with name: " + className.value);

            // Show the generated code to share with the class
            dialog.value = true;
            code.value = "04c7c759-c41e-4ea9-968a-1e2a987ce0ed";
        }
    }

    // show the teacher, copying of the code was a successs
    const copied = ref(false);

    // Copy the generated code to the clipboard
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
