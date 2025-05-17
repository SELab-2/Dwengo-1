<script setup lang="ts">
    import { ref, computed, watchEffect } from "vue";
    import auth from "@/services/auth/auth-service.ts";
    import { useI18n } from "vue-i18n";
    import { useAssignmentQuery } from "@/queries/assignments.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import type { AssignmentResponse } from "@/controllers/assignments.ts";
    import { asyncComputed } from "@vueuse/core";
    import { useStudentGroupsQuery, useStudentsByUsernamesQuery } from "@/queries/students.ts";
    import { useGetLearningPathQuery } from "@/queries/learning-paths.ts";
    import type { Language } from "@/data-objects/language.ts";
    import { calculateProgress } from "@/utils/assignment-utils.ts";
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";

    const props = defineProps<{
        classId: string;
        assignmentId: number;
    }>();

    const { t } = useI18n();
    const lang = ref();
    const learningPath = ref();
    // Get the user's username/id
    const username = asyncComputed(async () => {
        const user = await auth.loadUser();
        return user?.profile?.preferred_username ?? undefined;
    });

    const assignmentQueryResult = useAssignmentQuery(() => props.classId, props.assignmentId);
    learningPath.value = assignmentQueryResult.data.value?.assignment?.learningPath;

    const groupsQueryResult = useStudentGroupsQuery(username, true);
    const group = computed(() => {
        const groups = groupsQueryResult.data.value?.groups;

        if (!groups) return undefined;

        // Sort by original groupNumber
        const sortedGroups = [...groups].sort((a, b) => a.groupNumber - b.groupNumber);

        return sortedGroups
            .map((group, index) => ({
                ...group,
                groupNo: index + 1, // Renumbered index
            }))
            .find((group) => group.members?.some((m) => m.username === username.value));
    });

    watchEffect(() => {
        learningPath.value = assignmentQueryResult.data.value?.assignment?.learningPath;
        lang.value = assignmentQueryResult.data.value?.assignment?.language as Language;
    });

    const learningPathParams = computed(() => {
        if (!group.value || !learningPath.value || !lang.value) return undefined;

        return {
            forGroup: group.value.groupNumber,
            assignmentNo: props.assignmentId,
            classId: props.classId,
        };
    });

    const lpQueryResult = useGetLearningPathQuery(
        () => learningPath.value,
        () => lang.value,
        () => learningPathParams.value,
    );

    const progressColor = computed(() => {
        const progress = calculateProgress(lpQueryResult.data.value as LearningPath);
        if (progress >= 100) return "success";
        if (progress >= 50) return "warning";
        return "error";
    });

    const studentQueries = useStudentsByUsernamesQuery(() => (group.value?.members as string[]) ?? undefined);
</script>

<template>
    <div class="container">
        <using-query-result
            :query-result="assignmentQueryResult"
            v-slot="assignmentResponse: { data: AssignmentResponse }"
        >
            <v-card
                v-if="assignmentResponse"
                class="assignment-card"
            >
                <div class="top-buttons">
                    <v-btn
                        icon
                        variant="text"
                        class="back-btn"
                        to="/user/assignment"
                    >
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                </div>
                <v-card-title class="text-h4 assignmentTopTitle"
                    >{{ assignmentResponse.data.assignment.title }}
                </v-card-title>

                <v-card-subtitle class="subtitle-section">
                    <using-query-result
                        :query-result="lpQueryResult"
                        v-slot="{ data: lpData }"
                    >
                        <v-btn
                            v-if="lpData"
                            :to="
                                group
                                    ? `/learningPath/${lpData.hruid}/${assignmentResponse.data.assignment?.language}/${lpData.startNode.learningobjectHruid}?forGroup=${0}&assignmentNo=${assignmentId}&classId=${classId}`
                                    : undefined
                            "
                            :disabled="!group"
                            variant="tonal"
                            color="primary"
                        >
                            {{ t("learning-path") }}
                        </v-btn>
                    </using-query-result>
                </v-card-subtitle>

                <v-card-text class="description">
                    {{ assignmentResponse.data.assignment.description }}
                </v-card-text>
                <v-card-text>
                    <v-card-text>
                        <h3 class="mb-2">{{ t("progress") }}</h3>
                        <using-query-result
                            :query-result="lpQueryResult"
                            v-slot="{ data: learningPData }"
                        >
                            <v-progress-linear
                                v-if="group"
                                :model-value="calculateProgress(learningPData)"
                                :color="progressColor"
                                height="20"
                                class="progress-bar"
                            >
                                <template v-slot:default="{ value }">
                                    <strong>{{ Math.ceil(value) }}%</strong>
                                </template>
                            </v-progress-linear>
                        </using-query-result>
                    </v-card-text>
                </v-card-text>

                <v-card-text class="group-section">
                    <h3>{{ t("group") }}</h3>

                    <div v-if="group && studentQueries">
                        <ul>
                            <li
                                v-for="student in group.members"
                                :key="student.username"
                            >
                                {{ student.firstName + " " + student.lastName }}
                            </li>
                        </ul>
                    </div>

                    <div v-else>
                        <v-alert class="empty-message">
                            <v-icon
                                icon="mdi-information-outline"
                                size="small"
                            />
                            {{ t("currently-no-groups") }}
                        </v-alert>
                    </div>
                </v-card-text>
            </v-card>
        </using-query-result>
    </div>
</template>

<style scoped>
    @import "@/assets/assignment.css";

    .progress-bar {
        width: 40%;
    }
</style>
