<script setup lang="ts">
    import auth from "@/services/auth/auth-service.ts";
    import { computed, type Ref, ref, watchEffect } from "vue";
    import StudentAssignment from "@/views/assignments/StudentAssignment.vue";
    import TeacherAssignment from "@/views/assignments/TeacherAssignment.vue";
    import { useRoute } from "vue-router";
    import type { Language } from "@/data-objects/language.ts";
    import { useGetLearningPathQuery } from "@/queries/learning-paths.ts";
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
    import type { GroupDTO } from "@dwengo-1/common/interfaces/group";
    import { AccountType } from "@dwengo-1/common/util/account-types";

    const role = auth.authState.activeRole;
    const isTeacher = computed(() => role === AccountType.Teacher);

    const route = useRoute();
    const classId = ref<string>(route.params.classId as string);
    const assignmentId = ref(Number(route.params.id));

    function useGroupsWithProgress(
        groups: Ref<GroupDTO[]>,
        hruid: Ref<string>,
        language: Ref<string>,
    ): { groupProgressMap: Map<number, number> } {
        const groupProgressMap: Map<number, number> = new Map<number, number>();

        watchEffect(() => {
            // Clear existing entries to avoid stale data
            groupProgressMap.clear();

            const lang = ref(language.value as Language);

            groups.value.forEach((group) => {
                const groupKey = group.groupNumber;
                const forGroup = ref({
                    forGroup: groupKey,
                    assignmentNo: assignmentId,
                    classId: classId,
                });

                const query = useGetLearningPathQuery(hruid.value, lang, forGroup);

                const data = query.data.value;

                groupProgressMap.set(groupKey, data ? calculateProgress(data) : 0);
            });
        });

        return {
            groupProgressMap,
        };
    }

    function calculateProgress(lp: LearningPath): number {
        return ((lp.amountOfNodes - lp.amountOfNodesLeft) / lp.amountOfNodes) * 100;
    }
</script>

<template>
    <TeacherAssignment
        :class-id="classId"
        :assignment-id="assignmentId"
        :use-groups-with-progress="useGroupsWithProgress"
        v-if="isTeacher"
    >
    </TeacherAssignment>
    <StudentAssignment
        :class-id="classId"
        :assignment-id="assignmentId"
        :use-groups-with-progress="useGroupsWithProgress"
        v-else
    >
    </StudentAssignment>
</template>

<style scoped></style>
