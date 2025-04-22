<script setup lang="ts">
    import { computed, type Ref, ref } from "vue";
    import { useI18n } from "vue-i18n";
    import { useAssignmentQuery, useDeleteAssignmentMutation } from "@/queries/assignments.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { useGroupsQuery } from "@/queries/groups.ts";
    import { useGetLearningPathQuery } from "@/queries/learning-paths.ts";
    import type { Language } from "@/data-objects/language.ts";
    import type { AssignmentResponse } from "@/controllers/assignments.ts";
    import type { GroupDTO } from "@dwengo-1/common/interfaces/group";

    const props = defineProps<{
        classId: string;
        assignmentId: number;
        useGroupsWithProgress: (
            groups: Ref<GroupDTO[]>,
            hruid: Ref<string>,
            language: Ref<Language>,
        ) => { groupProgressMap: Map<number, number> };
    }>();

    const { t, locale } = useI18n();
    const language = computed(() => locale.value);
    const groups = ref();
    const learningPath = ref();

    const assignmentQueryResult = useAssignmentQuery(() => props.classId, props.assignmentId);
    learningPath.value = assignmentQueryResult.data.value?.assignment?.learningPath;
    // Get learning path object
    const lpQueryResult = useGetLearningPathQuery(
        computed(() => assignmentQueryResult.data.value?.assignment?.learningPath ?? ""),
        computed(() => language.value as Language),
    );

    // Get all the groups withing the assignment
    const groupsQueryResult = useGroupsQuery(props.classId, props.assignmentId, true);
    groups.value = groupsQueryResult.data.value?.groups;

    /* Crashes right now cause api data has inexistent hruid TODO: uncomment later and use it in progress bar
Const {groupProgressMap} = props.useGroupsWithProgress(
    groups,
    learningPath,
    language
);
*/

    const allGroups = computed(() => {
        const groups = groupsQueryResult.data.value?.groups;
        if (!groups) return [];

        return groups.map((group) => ({
            name: `${t("group")} ${group.groupNumber}`,
            progress: 0, //GroupProgressMap[group.groupNumber],
            members: group.members,
            submitted: false, //TODO: fetch from submission
        }));
    });

    const dialog = ref(false);
    const selectedGroup = ref({});

    function openGroupDetails(group): void {
        selectedGroup.value = group;
        dialog.value = true;
    }

    const headers = computed(() => [
        { title: t("group"), align: "start", key: "name" },
        { title: t("progress"), align: "center", key: "progress" },
        { title: t("submission"), align: "center", key: "submission" },
    ]);

    const { mutate } = useDeleteAssignmentMutation();

    async function deleteAssignment(num: number, clsId: string): Promise<void> {
        mutate({
            cid: clsId,
            an: num,
        });
        window.location.href = "/user/assignment";
    }
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

                    <v-btn
                        icon
                        variant="text"
                        class="top-right-btn"
                        @click="deleteAssignment(data.assignment.id, data.assignment.within)"
                    >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </div>
                <v-card-title class="text-h4 assignmentTopTitle">{{ data.assignment.title }}</v-card-title>
                <v-card-subtitle class="subtitle-section">
                    <using-query-result
                        :query-result="lpQueryResult"
                        v-slot="{ data: lpData }"
                    >
                        <v-btn
                            v-if="lpData"
                            :to="`/learningPath/${lpData.hruid}/${language}/${lpData.startNode.learningobjectHruid}?assignmentNo=${assignmentId}&classId=${classId}`"
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

                <v-card-text class="group-section">
                    <h3>{{ t("groups") }}</h3>
                    <div class="table-scroll">
                        <v-data-table
                            :headers="headers"
                            :items="allGroups"
                            item-key="id"
                            class="elevation-1"
                        >
                            <template #[`item.name`]="{ item }">
                                <v-btn
                                    @click="openGroupDetails(item)"
                                    variant="text"
                                    color="primary"
                                >
                                    {{ item.name }}
                                </v-btn>
                            </template>

                            <template #[`item.progress`]="{ item }">
                                <v-progress-linear
                                    :model-value="item.progress"
                                    color="blue-grey"
                                    height="25"
                                >
                                    <template v-slot:default="{ value }">
                                        <strong>{{ Math.ceil(value) }}%</strong>
                                    </template>
                                </v-progress-linear>
                            </template>

                            <template #[`item.submission`]="{ item }">
                                <v-btn
                                    :to="item.submitted ? `${props.assignmentId}/submissions/` : undefined"
                                    :color="item.submitted ? 'green' : 'red'"
                                    variant="text"
                                    class="text-capitalize"
                                >
                                    {{ item.submitted ? t("see-submission") : t("no-submission") }}
                                </v-btn>
                            </template>
                        </v-data-table>
                    </div>
                </v-card-text>

                <v-dialog
                    v-model="dialog"
                    max-width="50%"
                >
                    <v-card>
                        <v-card-title class="headline">{{ t("members") }}</v-card-title>
                        <v-card-text>
                            <v-list>
                                <v-list-item
                                    v-for="(member, index) in selectedGroup.members"
                                    :key="index"
                                >
                                    <v-list-item-content>
                                        <v-list-item-title
                                            >{{ member.firstName + " " + member.lastName }}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
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
                <!--
                <v-card-actions class="justify-end">
                    <v-btn
                        size="large"
                        color="success"
                        variant="text"
                    >
                        {{ t("view-submissions") }}
                    </v-btn>
                </v-card-actions>
                -->
            </v-card>
        </using-query-result>
    </div>
</template>

<style scoped>
    @import "@/assets/assignment.css";

    .table-scroll {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>
