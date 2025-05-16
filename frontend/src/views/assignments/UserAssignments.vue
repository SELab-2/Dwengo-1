<script setup lang="ts">
    import { ref, computed, onMounted, watch } from "vue";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";
    import authState from "@/services/auth/auth-service.ts";
    import auth from "@/services/auth/auth-service.ts";
    import { useTeacherAssignmentsQuery, useTeacherClassesQuery } from "@/queries/teachers.ts";
    import { useStudentAssignmentsQuery, useStudentClassesQuery } from "@/queries/students.ts";
    import { useDeleteAssignmentMutation } from "@/queries/assignments.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { asyncComputed } from "@vueuse/core";

    const { t, locale } = useI18n();
    const router = useRouter();

    const role = ref(auth.authState.activeRole);
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

    const isTeacher = computed(() => role.value === "teacher");
    const classesQueryResult = isTeacher.value
        ? useTeacherClassesQuery(username, true)
        : useStudentClassesQuery(username, true);

    const assignmentsQueryResult = isTeacher.value
        ? useTeacherAssignmentsQuery(username, true)
        : useStudentAssignmentsQuery(username, true);

    const allAssignments = asyncComputed(
        async () => {
            const assignments = assignmentsQueryResult.data.value?.assignments;
            if (!assignments) return [];

            const classes = classesQueryResult.data.value?.classes;
            if (!classes) return [];

            const result = assignments.map((a) => ({
                id: a.id,
                class: classes.find((cls) => cls?.id === a.within) ?? undefined,
                title: a.title,
                description: a.description,
                learningPath: a.learningPath,
                language: a.language,
                deadline: a.deadline,
                groups: a.groups,
            }));

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
            hour: "numeric",
            minute: "2-digit",
        });
    }

    function getDeadlineClass(deadline?: string | Date): string {
        if (!deadline) return "";

        const date = new Date(deadline);
        const now = new Date();
        const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        if (date.getTime() < now.getTime()) return "deadline-passed";
        if (date.getTime() <= in24Hours.getTime()) return "deadline-in24hours";
        return "deadline-upcoming";
    }

    onMounted(async () => {
        const user = await auth.loadUser();
        username.value = user?.profile?.preferred_username ?? "";
    });

    onMounted(async () => {
        const user = await auth.loadUser();
        username.value = user?.profile?.preferred_username ?? "";
    });
</script>

<template>
    <div class="assignments-container">
        <h1 class="h1">{{ t("assignments") }}</h1>

        <v-btn
            v-if="isTeacher"
            color="primary"
            class="mb-4 center-btn"
            @click="goToCreateAssignment"
        >
            {{ t("new-assignment") }}
        </v-btn>

        <using-query-result :query-result="assignmentsQueryResult">
            <v-container>
                <v-row>
                    <v-col
                        v-for="assignment in allAssignments"
                        :key="assignment.id"
                        cols="12"
                    >
                        <v-card class="assignment-card">
                            <div class="top-content">
                                <div class="assignment-title">{{ assignment.title }}</div>
                                <div class="assignment-class">
                                    {{ t("class") }}:
                                    <span class="class-name">
                                        {{ assignment?.class?.displayName }}
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
                                    @click="goToAssignmentDetails(assignment.id, assignment?.class?.id)"
                                >
                                    {{ t("view-assignment") }}
                                </v-btn>
                                <v-btn
                                    v-if="isTeacher"
                                    color="red"
                                    variant="text"
                                    @click="goToDeleteAssignment(assignment.id, assignment?.class?.id)"
                                >
                                    {{ t("delete") }}
                                </v-btn>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row v-if="allAssignments.length === 0">
                    <v-col cols="12">
                        <div class="no-assignments">
                            {{ t("no-assignments") }}
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </using-query-result>
    </div>
</template>

<style scoped>
    .assignments-container {
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
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

    .assignment-deadline.deadline-in24hours {
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
