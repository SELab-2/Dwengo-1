<script setup lang="ts">
    import { computed, type ComputedRef, ref, watchEffect } from "vue";
    import auth from "@/services/auth/auth-service.ts";
    import { useI18n } from "vue-i18n";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { asyncComputed } from "@vueuse/core";
    import { useStudentsByUsernamesQuery } from "@/queries/students.ts";
    import { useGetLearningPathQuery } from "@/queries/learning-paths.ts";
    import type { Language } from "@/data-objects/language.ts";
    import { calculateProgress } from "@/utils/assignment-utils.ts";
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
    import type { GroupDTO } from "@dwengo-1/common/interfaces/group";
    import { useAssignmentQuery } from "@/queries/assignments.ts";
    import type { AssignmentDTO } from "@dwengo-1/common/interfaces/assignment";
    import type { StudentDTO } from "@dwengo-1/common/interfaces/student";

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

    const assignmentQueryResult = useAssignmentQuery(props.classId, props.assignmentId);

    const assignment: ComputedRef<AssignmentDTO | undefined> = computed(
        () => assignmentQueryResult.data.value?.assignment,
    );

    learningPath.value = assignment.value?.learningPath;

    const group = computed(() => {
        const groups = assignment.value?.groups as GroupDTO[];

        if (!groups) return undefined;

        // To "normalize" the group numbers, sort the groups and then renumber them
        const renumbered = [...groups]
            .sort((a, b) => a.groupNumber - b.groupNumber)
            .map((group, index) => ({ ...group, groupNo: index + 1 }));
        return renumbered.find((group) => group.members?.some((m) => (m as StudentDTO).username === username.value));
    });

    watchEffect(() => {
        learningPath.value = assignment.value?.learningPath;
        lang.value = assignment.value?.language as Language;
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
        <using-query-result :query-result="assignmentQueryResult">
            <v-card
                v-if="assignment"
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
                <v-card-title class="text-h4 assignmentTopTitle">{{ assignment.title }} </v-card-title>

                <v-card-subtitle class="subtitle-section">
                    <using-query-result
                        :query-result="lpQueryResult"
                        v-slot="{ data: lpData }"
                    >
                        <v-btn
                            v-if="lpData"
                            :to="
                                group
                                    ? `/learningPath/${lpData.hruid}/${assignment.language}/${lpData.startNode.learningobjectHruid}?forGroup=${group.groupNumber}&assignmentNo=${assignment.id}&classId=${assignment.within}`
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
                    {{ assignment.description }}
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

                <v-card-text
                    class="group-section"
                    v-if="group && studentQueries"
                >
                    <h3>{{ `${t("group")} ${group.groupNo}` }}</h3>

                    <div>
                        <ul>
                            <li
                                v-for="student in group.members"
                                :key="student.username"
                            >
                                {{ student.firstName + " " + student.lastName }}
                            </li>
                        </ul>
                    </div>
                </v-card-text>
                <v-card-text
                    class="group-section"
                    v-else
                >
                    <h3>{{ t("group") }}</h3>
                    <div>
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
