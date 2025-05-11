<script setup lang="ts">
    import { ref, computed, onMounted, watch } from "vue";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";
    import auth from "@/services/auth/auth-service.ts";
    import { useTeacherClassesQuery } from "@/queries/teachers.ts";
    import { useStudentClassesQuery } from "@/queries/students.ts";
    import { ClassController } from "@/controllers/classes.ts";
    import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
    import { asyncComputed } from "@vueuse/core";
    import { useDeleteAssignmentMutation } from "@/queries/assignments.ts";

    const { t, locale } = useI18n();
    const router = useRouter();

    const role = ref(auth.authState.activeRole);
    const username = ref<string>("");

    const isTeacher = computed(() => role.value === "teacher");

    // Fetch and store all the teacher's classes
    let classesQueryResults = undefined;

    if (isTeacher.value) {
        classesQueryResults = useTeacherClassesQuery(username, true);
    } else {
        classesQueryResults = useStudentClassesQuery(username, true);
    }

    const classController = new ClassController();

    const assignments = asyncComputed(
        async () => {
            const classes = classesQueryResults?.data?.value?.classes;
            if (!classes) return [];

            const result = await Promise.all(
                (classes as ClassDTO[]).map(async (cls) => {
                    const { assignments } = await classController.getAssignments(cls.id);
                    return assignments.map((a) => ({
                        id: a.id,
                        class: cls,
                        title: a.title,
                        description: a.description,
                        learningPath: a.learningPath,
                        language: a.language,
                        deadline: a.deadline,
                        groups: a.groups,
                    }));
                }),
            );

            // Order the assignments by deadline
            return result.flat().sort((a, b) => {
                const now = Date.now();
                const aTime = new Date(a.deadline).getTime();
                const bTime = new Date(b.deadline).getTime();

                const aIsPast = aTime < now;
                const bIsPast = bTime < now;

                if (aIsPast && !bIsPast) return 1;
                if (!aIsPast && bIsPast) return -1;

                return aTime - bTime;
            });
        },
        [],
        { evaluating: true },
    );

    async function goToCreateAssignment(): Promise<void> {
        await router.push("/assignment/create");
    }

    async function goToAssignmentDetails(id: number, clsId: string): Promise<void> {
        await router.push(`/assignment/${clsId}/${id}`);
    }

    const { mutate, data, isSuccess } = useDeleteAssignmentMutation();

    watch([isSuccess, data], async ([success, oldData]) => {
        if (success && oldData?.assignment) {
            window.location.reload();
        }
    });

    async function goToDeleteAssignment(num: number, clsId: string): Promise<void> {
        mutate({ cid: clsId, an: num });
    }

    function formatDate(date?: string | Date): string {
        if (!date) return "–";
        const d = new Date(date);

        // Choose locale based on selected language
        const currentLocale = locale.value;

        return d.toLocaleDateString(currentLocale, {
            weekday: "short",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    function getDeadlineClass(deadline?: string | Date): string {
        if (!deadline) return "";
        const date = new Date(deadline);
        const now = new Date();
        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        if (date.getTime() < now.getTime()) return "deadline-passed";
        if (isToday) return "deadline-today";
        return "deadline-upcoming";
    }

    onMounted(async () => {
        const user = await auth.loadUser();
        username.value = user?.profile?.preferred_username ?? "";
    });
</script>

<template>
    <div class="assignments-container">
        <h1>{{ t("assignments") }}</h1>

        <v-btn
            v-if="isTeacher"
            color="primary"
            class="mb-4 center-btn"
            @click="goToCreateAssignment"
        >
            {{ t("new-assignment") }}
        </v-btn>

        <v-container>
            <v-row>
                <v-col
                    v-for="assignment in assignments"
                    :key="assignment.id"
                    cols="12"
                >
                    <v-card class="assignment-card">
                        <div class="top-content">
                            <div class="assignment-title">{{ assignment.title }}</div>
                            <div class="assignment-class">
                                {{ t("class") }}:
                                <span class="class-name">
                                    {{ assignment.class.displayName }}
                                </span>
                            </div>
                            <div
                                class="assignment-deadline"
                                :class="getDeadlineClass(assignment.deadline)"
                            >
                                {{ t("deadline") }}:
                                <span>{{ formatDate(assignment.deadline) }}</span>
                            </div>
                        </div>

                        <div class="spacer"></div>

                        <div class="button-row">
                            <v-btn
                                color="primary"
                                variant="text"
                                @click="goToAssignmentDetails(assignment.id, assignment.class.id)"
                            >
                                {{ t("view-assignment") }}
                            </v-btn>
                            <v-btn
                                v-if="isTeacher"
                                color="red"
                                variant="text"
                                @click="goToDeleteAssignment(assignment.id, assignment.class.id)"
                            >
                                {{ t("delete") }}
                            </v-btn>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-if="assignments.length === 0">
                <v-col cols="12">
                    <div class="no-assignments">
                        {{ t("no-assignments") }}
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style scoped>
    .assignments-container {
        width: 100%;
        margin: 0 auto;
        padding: 2% 4%;
        box-sizing: border-box;
    }

    h1 {
        color: #0e6942;
        text-transform: uppercase;
        font-weight: bolder;
        font-size: 50px;
    }

    .center-btn {
        display: block;
        margin: 0 auto 2rem auto;
        font-weight: 600;
        background-color: #10ad61;
        color: white;
        transition: background-color 0.2s;
    }
    .center-btn:hover {
        background-color: #0e6942;
    }

    .assignment-card {
        padding: 1.25rem;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        background-color: white;
        transition:
            transform 0.2s,
            box-shadow 0.2s;
    }
    .assignment-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }

    .top-content {
        margin-bottom: 1rem;
        word-break: break-word;
    }

    .assignment-title {
        font-weight: 700;
        font-size: 1.4rem;
        color: #0e6942;
        margin-bottom: 0.3rem;
    }

    .assignment-class,
    .assignment-deadline {
        font-size: 0.95rem;
        color: #444;
        margin-bottom: 0.2rem;
    }

    .class-name {
        font-weight: 600;
        color: #097180;
    }

    .assignment-deadline.deadline-passed {
        color: #d32f2f;
        font-weight: bold;
    }

    .assignment-deadline.deadline-today {
        color: #f57c00;
        font-weight: bold;
    }

    .spacer {
        flex: 1;
    }

    .button-row {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    .no-assignments {
        text-align: center;
        font-size: 1.2rem;
        color: #777;
        padding: 3rem 0;
    }
</style>
