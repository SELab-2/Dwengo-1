<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import authState from "@/services/auth/auth-service.ts";
    import { computed, onMounted, ref, type ComputedRef } from "vue";
    import type { TeacherDTO } from "@dwengo-1/common/interfaces/teacher";
    import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
    import type { TeacherInvitationDTO } from "@dwengo-1/common/interfaces/teacher-invitation";
    import { useTeacherClassesQuery } from "@/queries/teachers";
    import { ClassController, type ClassResponse } from "@/controllers/classes";

    const { t } = useI18n();
    const classController = new ClassController();

    // Username of logged in teacher
    const username = ref<string | undefined>(undefined);

    // Find the username of the logged in user so it can be used to fetch other information
    // When loading the page
    onMounted(async () => {
        const userObject = await authState.loadUser();
        username.value = userObject?.profile?.preferred_username ?? undefined;
    });

    // Fetch all classes of the logged in teacher
    const { data: classesResponse, isLoading, error, refetch } = useTeacherClassesQuery(username, true);

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

    // Boolean that handles visibility for dialogs
    // Creating a class will generate a popup with the generated code
    const dialog = ref(false);

    // Code generated when new class was created
    const code = ref<string>("");

    // TODO: waiting on frontend controllers
    const invitations = ref<TeacherInvitationDTO[]>([]);

    // Function to handle a accepted invitation request
    function acceptRequest(): void {
        //TODO > waiting on updated frontend controllers
        console.log("request accepted");
    }

    // Function to handle a denied invitation request
    function denyRequest(): void {
        //TODO > waiting on frontend controllers
        console.log("request denied");
    }

    // Teacher should be able to set a displayname when making a class
    const className = ref<string>("");

    // The name can only contain dash, underscore letters and numbers
    // These rules are used to display a message to the user if the name is not valid
    const nameRules = [
        (value: string | undefined): string | boolean => {
            if (!value) return true;
            if (value && /^[a-zA-Z0-9_-]+$/.test(value)) return true;
            return t("onlyUse");
        },
    ];

    // Function called when a teacher creates a class
    async function createClass(): Promise<void> {
        // Check if the class name is valid
        if (className.value && className.value.length > 0 && /^[a-zA-Z0-9_-]+$/.test(className.value)) {
            try {
                const classDto: ClassDTO = {
                    id: "",
                    displayName: className.value,
                    teachers: [username.value!],
                    students: [],
                    joinRequests: [],
                };
                const classResponse: ClassResponse = await classController.createClass(classDto);
                const createdClass: ClassDTO = classResponse.cls;
                code.value = createdClass.id;
                dialog.value = true;
                showSnackbar(t("created"), "success");

                // reload the table with classes
                await refetch();
            } catch (e: any) {
                showSnackbar(t("wrong"), "error");
            }
        }
        if (!className.value || className.value === "") {
            alert("classname should not be empty");
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

    // Show the teacher, copying of the code was a successs
    const copied = ref(false);

    // Copy the generated code to the clipboard
    async function copyToClipboard(): Promise<void> {
        await navigator.clipboard.writeText(code.value);
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
                                    <th class="header">
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
                                    <td>
                                        <v-btn
                                            :to="`/class/${c.id}`"
                                            variant="text"
                                        >
                                            {{ c.displayName }}
                                            <v-icon end> mdi-menu-right </v-icon>
                                        </v-btn>
                                    </td>
                                    <td>{{ c.id }}</td>
                                    <td>{{ c.students.length }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="6"
                    >
                        <div>
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

            <h1 class="title">
                {{ t("invitations") }}
            </h1>
            <v-table class="table">
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
                        :key="(i.class as ClassDTO).id"
                    >
                        <td>
                            {{ (i.class as ClassDTO).displayName }}
                        </td>
                        <td>{{ (i.sender as TeacherDTO).firstName + " " + (i.sender as TeacherDTO).lastName }}</td>
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
