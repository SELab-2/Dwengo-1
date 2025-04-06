<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import authState from "@/services/auth/auth-service.ts";
    import { computed, onMounted, ref, type ComputedRef } from "vue";
    import type { TeacherDTO } from "@dwengo-1/common/interfaces/teacher";
    import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
    import type { TeacherInvitationDTO } from "@dwengo-1/common/interfaces/teacher-invitation";
    import { useTeacherClassesQuery } from "@/queries/teachers";
    import { useRoute } from "vue-router";
    import { ClassController, type ClassResponse } from "@/controllers/classes";
    import type { StudentsResponse } from "@/controllers/students";
    import { type StudentDTO } from "@dwengo-1/common/interfaces/student";

    const { t } = useI18n();

    // Username of logged in teacher
    const username = ref<string | undefined>(undefined);
    const classController: ClassController = new ClassController();

    // find class id from route
    const route = useRoute();
    const classId: string = route.params.id as string;

    const isLoading = ref(true);
    const currentClass = ref<ClassDTO | undefined>(undefined);
    const students = ref<StudentDTO[]>([]);

    // Find the username of the logged in user so it can be used to fetch other information
    // When loading the page
    onMounted(async () => {
        const userObject = await authState.loadUser();
        username.value = userObject?.profile?.preferred_username ?? undefined;

        // get class of which information should be shown
        const classResponse: ClassResponse = await classController.getById(classId);
        console.log(classResponse);
        if (classResponse && classResponse.class) {
            currentClass.value = classResponse.class;
            isLoading.value = false;
        }

        // Fetch all students of the class
        const studentsResponse: StudentsResponse = await classController.getStudents(classId);
        if (studentsResponse && studentsResponse.students) students.value = studentsResponse.students as StudentDTO[];

    });

    // TODO: Boolean that handles visibility for dialogs
    // Creating a class will generate a popup with the generated code
    const dialog = ref(false);

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

    // remove student from class
    function removeStudentFromclass(s: StudentDTO): void {
        //TODO
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
                                        <v-btn @click="removeStudentFromclass(s)"> remove </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
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
