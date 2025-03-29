<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import authState from "@/services/auth/auth-service.ts";
    import { ref, watch } from "vue";
    import { validate, version } from "uuid";

    const { t } = useI18n();

    const role: String = authState.authState.activeRole!;

    type Teacher = {
        username: string;
        firstName: string;
        lastName: string;
        classes: Array<Class>;
    };

    type Student = {
        username: string;
        firstName: string;
        lastName: string;
        classes: Array<Class>;
    };

    type Class = {
        id: string;
        displayName: string;
        teachers: Array<Teacher>;
        students: Array<Student>;
    };

    const classIds: Array<string> = ["class01", "class02", "class03"];
    let student01: Student = { username: "id01", firstName: "Mark", lastName: "Knopfler", classes: [] };
    let student02: Student = { username: "id01", firstName: "John", lastName: "Hiat", classes: [] };
    let student03: Student = { username: "id01", firstName: "Aaron", lastName: "Lewis", classes: [] };

    const class01: Class = { id: "class01", displayName: "class 01", teachers: [], students: [student01, student02] };
    const class02: Class = { id: "class02", displayName: "class 02", teachers: [], students: [student01, student03] };
    const class03: Class = { id: "class03", displayName: "class 03", teachers: [], students: [student02, student03] };

    student01.classes = [class01, class02];
    student02.classes = [class01, class03];
    student03.classes = [class02, class03];

    const classes: Array<Class> = [class01, class02, class03];

    const valid = ref(false);
    const code = ref<string>("");
    const codeRules = [
        (value: string | undefined) => {
            if (value !== undefined && validate(value) && version(value) === 4) return true;
            return "Invalid format.";
        },
    ];
    watch(code, (newValue) => {
        if (code.value !== undefined && validate(code.value) && version(code.value) == 4) {
            console.log("Code changed:", newValue);
        }
    });

    // handle dialog for showing members of a class
    const dialog = ref(false);
    const students = ref<Array<string>>([]);
    const selectedClass = ref<Class | null>(null);

    const openDialog = (c: Class) => {
        selectedClass.value = c;
        if (selectedClass !== undefined) {
            students.value = selectedClass.value.students.map((student) => `${student.firstName} ${student.lastName}`);
            dialog.value = true;
        }
    };
</script>
<template>
    <main>
        <h class="title">{{ t("classes") }}</h>

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
                            :key="student"
                        >
                            {{ student }}
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
                <h1>{{ t("joinClass") }}</h1>
                <p>{{ t("JoinClassExplanation") }}</p>
                <v-form v-model="valid">
                    <v-text-field
                        label="CODE"
                        v-model="code"
                        :rules="codeRules"
                        variant="outlined"
                        max-width="400px"
                    ></v-text-field>
                </v-form>
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
        width: 60%;
        margin: 0 auto;
        padding-top: 3%;
        border-collapse: collapse;
    }

    .title {
        color: #0e6942;
        text-transform: uppercase;
        font-weight: bolder;
        padding-left: 30px;
        padding-top: 2%;
        font-size: 50px;
    }

    h1 {
        color: #0e6942;
        font-size: 30px;
    }

    .join {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-left: 30px;
        margin-top: 50px;
    }

    .link {
        color: #0b75bb;
        text-decoration: underline;
    }
</style>
