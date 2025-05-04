<script setup lang="ts">
import {ref, computed, type Ref, watchEffect} from "vue";
    import auth from "@/services/auth/auth-service.ts";
    import { useI18n } from "vue-i18n";
    import { useAssignmentQuery } from "@/queries/assignments.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import type { AssignmentResponse } from "@/controllers/assignments.ts";
    import { asyncComputed } from "@vueuse/core";
    import { useStudentsByUsernamesQuery } from "@/queries/students.ts";
    import { useGroupsQuery } from "@/queries/groups.ts";
    import { useGetLearningPathQuery } from "@/queries/learning-paths.ts";
    import type { Language } from "@/data-objects/language.ts";
    import type { GroupDTO } from "@dwengo-1/common/interfaces/group";
import {calculateProgress} from "@/utils/assignment-utils.ts";

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

    const submitted = ref(false); //TODO: update by fetching submissions and check if group submitted

    const groupsQueryResult = useGroupsQuery(props.classId, props.assignmentId, true);
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
            .find((group) =>
                group.members?.some((m) => m.username === username.value),
            );
    });


watchEffect(() => {
        learningPath.value = assignmentQueryResult.data.value?.assignment?.learningPath;
        lang.value = assignmentQueryResult.data.value?.assignment?.language as Language;
    });

    const lpQueryResult = useGetLearningPathQuery(
        () => learningPath.value,
        () => lang.value,
        () => ({
            forGroup: group.value?.groupNumber ?? Number.NaN,
            assignmentNo: props.assignmentId,
            classId: props.classId,
        }),
    );

    const progressColor = computed(() => {
        const progress = calculateProgress(lpQueryResult.data.value);
        if (progress >= 100) return "success";
        if (progress >= 50) return "warning";
        return "error";
    });

    // Assuming group.value.members is a list of usernames TODO: case when it's StudentDTO's
    const studentQueries = useStudentsByUsernamesQuery(() => group.value?.members as string[]);
</script>

<template>
    <div class="container">
        <using-query-result
            :query-result="assignmentQueryResult"
            v-slot="{ data }: { data: AssignmentResponse }"
        >
            <v-card
                v-if="data"
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

                    <v-chip
                        v-if="submitted"
                        class="ma-2 top-right-btn"
                        label
                        color="success"
                    >
                        {{ t("submitted") }}
                    </v-chip>
                </div>
                <v-card-title class="text-h4 assignmentTopTitle">{{ data.assignment.title }}</v-card-title>

                <v-card-subtitle class="subtitle-section">
                    <using-query-result
                        :query-result="lpQueryResult"
                        v-slot="{ data: lpData }"
                    >
                        <v-btn
                            v-if="lpData"
                            :to="`/learningPath/${lpData.hruid}/${assignmentQueryResult.data.value?.assignment?.language}/${lpData.startNode.learningobjectHruid}?forGroup=${group?.groupNumber}&assignmentNo=${assignmentId}&classId=${classId}`"
                            variant="tonal"
                            color="primary"
                        >
                            {{ t("learning-path") }}
                        </v-btn>
                    </using-query-result>
                </v-card-subtitle>

                <v-card-text class="description">
                    {{ data.assignment.description }}
                </v-card-text>
                <v-card-text>
                    <v-card-text>
                        <h3 class="mb-2">{{ t("progress") }}</h3>
                        <using-query-result
                            :query-result="lpQueryResult"
                            v-slot="{ data: learningPData }"
                        >
                            <v-progress-linear
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
                    <div v-if="studentQueries">
                        <ul>
                            <li
                                v-for="student in group?.members"
                                :key="student.username"
                            >
                                {{ student.firstName + " " + student.lastName }}
                            </li>
                        </ul>
                    </div>
                </v-card-text>
            </v-card>
        </using-query-result>
    </div>
</template>

<style scoped>
    @import "@/assets/assignment.css";

    .progress-label {
        font-weight: bold;
        margin-right: 5px;
    }

    .progress-bar {
        width: 40%;
    }
</style>
