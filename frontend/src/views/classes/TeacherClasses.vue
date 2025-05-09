<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import authState from "@/services/auth/auth-service.ts";
    import { onMounted, ref, watchEffect } from "vue";
    import type { TeacherDTO } from "@dwengo-1/common/interfaces/teacher";
    import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
    import type { TeacherInvitationData, TeacherInvitationDTO } from "@dwengo-1/common/interfaces/teacher-invitation";
    import { useTeacherClassesQuery } from "@/queries/teachers";
    import type { ClassesResponse } from "@/controllers/classes";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { useClassesQuery, useCreateClassMutation } from "@/queries/classes";
    import type { TeacherInvitationsResponse } from "@/controllers/teacher-invitations";
    import {
        useRespondTeacherInvitationMutation,
        useTeacherInvitationsReceivedQuery,
    } from "@/queries/teacher-invitations";
    import { useDisplay } from "vuetify";
    import ClassDisplay from "@/views/classes/ClassDisplay.vue";

    const { t } = useI18n();

    // Username of logged in teacher
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

    // Fetch all classes of the logged in teacher
    const classesQuery = useTeacherClassesQuery(username, true);
    const { mutate } = useCreateClassMutation();
    const getInvitationsQuery = useTeacherInvitationsReceivedQuery(username);
    const { mutate: respondToInvitation } = useRespondTeacherInvitationMutation();

    // Boolean that handles visibility for dialogs
    // Creating a class will generate a popup with the generated code
    const dialog = ref(false);

    // Code generated when new class was created
    const code = ref<string>("");

    // Function to handle an invitation request
    function handleInvitation(ti: TeacherInvitationDTO, accepted: boolean): void {
        const data: TeacherInvitationData = {
            sender: (ti.sender as TeacherDTO).id,
            receiver: (ti.receiver as TeacherDTO).id,
            class: ti.classId,
            accepted: accepted,
        };
        respondToInvitation(data, {
            onSuccess: async () => {
                if (accepted) {
                    await classesQuery.refetch();
                }

                await getInvitationsQuery.refetch();
            },
            onError: (e) => {
                showSnackbar(t("failed") + ": " + e.response.data.error || e.message, "error");
            },
        });
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
            const classDto: ClassDTO = {
                id: "",
                displayName: className.value,
                teachers: [username.value!],
                students: [],
            };

            mutate(classDto, {
                onSuccess: async (classResponse) => {
                    showSnackbar(t("classCreated"), "success");
                    const createdClass: ClassDTO = classResponse.class;
                    code.value = createdClass.id;
                    await classesQuery.refetch();
                },
                onError: (err) => {
                    showSnackbar(t("creationFailed") + ": " + err.message, "error");
                },
            });
            dialog.value = true;
        }
        if (!className.value || className.value === "") {
            showSnackbar(t("name is mandatory"), "error");
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
    const isMdAndDown = ref(false);
    const isSmAndDown = ref(false);

    watchEffect(() => {
        // Custom breakpoint logic
        isMdAndDown.value = display.width.value < customBreakpoints.md;
        isSmAndDown.value = display.width.value < customBreakpoints.sm;
    });

    // Code display dialog logic
    const viewCodeDialog = ref(false);
    const selectedCode = ref("");
    function openCodeDialog(codeToView: string): void {
        selectedCode.value = codeToView;
        viewCodeDialog.value = true;
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
            <h1 class="title">{{ t("classes") }}</h1>
            <using-query-result
                :query-result="classesQuery"
                v-slot="classesResponse: { data: ClassesResponse }"
            >
                <v-container
                    fluid
                    class="ma-4"
                >
                    <v-row
                        no-gutters
                        class="custom-breakpoint"
                    >
                        <v-col
                            cols="12"
                            sm="6"
                            md="6"
                            class="responsive-col"
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
                                        v-for="c in classesResponse.data.classes as ClassDTO[]"
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
                                        <td>
                                            <span v-if="!isMdAndDown">{{ c.id }}</span>
                                            <span
                                                v-else
                                                style="cursor: pointer"
                                                @click="openCodeDialog(c.id)"
                                                ><v-icon icon="mdi-eye"></v-icon
                                            ></span>
                                        </td>

                                        <td>{{ c.students.length }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="6"
                            class="responsive-col"
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
            </using-query-result>

            <h1 class="title">
                {{ t("invitations") }}
            </h1>
            <v-container
                fluid
                class="ma-4"
            >
                <v-table class="table">
                    <thead>
                        <tr>
                            <th class="header">{{ t("class") }}</th>
                            <th class="header">{{ t("sender") }}</th>
                            <th class="header">{{ t("accept") + "/" + t("reject") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <using-query-result
                            :query-result="getInvitationsQuery"
                            v-slot="invitationsResponse: { data: TeacherInvitationsResponse }"
                        >
                            <tr
                                v-for="i in invitationsResponse.data.invitations as TeacherInvitationDTO[]"
                                :key="i.classId"
                            >
                                <td>
                                    <ClassDisplay :classId="i.classId" />
                                </td>
                                <td>
                                    {{
                                        (i.sender as TeacherDTO).firstName + " " + (i.sender as TeacherDTO).lastName
                                    }}
                                </td>
                                <td class="text-right">
                                    <span v-if="!isSmAndDown">
                                        <div>
                                            <v-btn
                                                color="green"
                                                @click="handleInvitation(i, true)"
                                                class="mr-2"
                                            >
                                                {{ t("accept") }}
                                            </v-btn>
                                            <v-btn
                                                color="red"
                                                @click="handleInvitation(i, false)"
                                            >
                                                {{ t("deny") }}
                                            </v-btn>
                                        </div>
                                    </span>
                                    <span v-else>
                                        <div>
                                            <v-btn
                                                @click="handleInvitation(i, true)"
                                                class="mr-2"
                                                icon="mdi-check-circle"
                                                color="green"
                                                variant="text"
                                            >
                                            </v-btn>
                                            <v-btn
                                                @click="handleInvitation(i, false)"
                                                class="mr-2"
                                                icon="mdi-close-circle"
                                                color="red"
                                                variant="text"
                                            >
                                            </v-btn></div
                                    ></span>
                                </td>
                            </tr>
                        </using-query-result>
                    </tbody>
                </v-table>
            </v-container>
        </div>
        <v-snackbar
            v-model="snackbar.visible"
            :color="snackbar.color"
            timeout="3000"
        >
            {{ snackbar.message }}
        </v-snackbar>
        <v-dialog
            v-model="viewCodeDialog"
            max-width="400px"
        >
            <v-card>
                <v-card-title class="headline">{{ t("code") }}</v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="selectedCode"
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
                            viewCodeDialog = false;
                            copied = false;
                        "
                    >
                        {{ t("close") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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

    @media screen and (max-width: 850px) {
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

        .custom-breakpoint {
            flex-direction: column !important;
        }

        .table {
            width: 100%;
        }

        .responsive-col {
            max-width: 100% !important;
            flex-basis: 100% !important;
        }
    }
</style>
