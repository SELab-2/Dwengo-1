<script setup lang="ts">
import {computed, ref, watchEffect} from "vue";
import {useI18n} from "vue-i18n";
import {useAssignmentQuery, useDeleteAssignmentMutation} from "@/queries/assignments.ts";
import UsingQueryResult from "@/components/UsingQueryResult.vue";
import {useGroupsQuery} from "@/queries/groups.ts";
import {useGetLearningPathQuery} from "@/queries/learning-paths.ts";
import type {Language} from "@/data-objects/language.ts";
import type {AssignmentResponse} from "@/controllers/assignments.ts";
import type {GroupDTO, GroupDTOId} from "@dwengo-1/common/interfaces/group";
import GroupProgressRow from "@/components/GroupProgressRow.vue";
import GroupSubmissionStatus from "@/components/GroupSubmissionStatus.vue";

const props = defineProps<{
    classId: string;
    assignmentId: number;
}>();

const {t} = useI18n();
const lang = ref();
const groups = ref<GroupDTO[] | GroupDTOId[]>([]);
const learningPath = ref();

const assignmentQueryResult = useAssignmentQuery(() => props.classId, props.assignmentId);
// Get learning path object
const lpQueryResult = useGetLearningPathQuery(
    computed(() => assignmentQueryResult.data.value?.assignment?.learningPath ?? ""),
    computed(() => assignmentQueryResult.data.value?.assignment?.language as Language),
);

// Get all the groups withing the assignment
const groupsQueryResult = useGroupsQuery(props.classId, props.assignmentId, true);
groups.value = groupsQueryResult.data.value?.groups ?? [];

watchEffect(() => {
    learningPath.value = assignmentQueryResult.data.value?.assignment?.learningPath;
    lang.value = assignmentQueryResult.data.value?.assignment?.language as Language;
});


const allGroups = computed(() => {
    const groups = groupsQueryResult.data.value?.groups;

    if (!groups) return [];

    // Sort by original groupNumber
    const sortedGroups = [...groups].sort((a, b) => a.groupNumber - b.groupNumber);

    // Assign new sequential numbers starting from 1
    return sortedGroups.map((group, index) => ({
        groupNo: index + 1, // New group number that will be used
        name: `${t("group")} ${index + 1}`,
        members: group.members,
        submitted: false, // TODO: fetch from submission
        originalGroupNo: group.groupNumber, // Keep original number if needed
    }));
});


const dialog = ref(false);
const selectedGroup = ref({});

function openGroupDetails(group): void {
    selectedGroup.value = group;
    dialog.value = true;
}

const headers = computed(() => [
    {title: t("group"), align: "start", key: "name"},
    {title: t("progress"), align: "center", key: "progress"},
    {title: t("submission"), align: "center", key: "submission"},
]);

const {mutate} = useDeleteAssignmentMutation();

async function deleteAssignment(num: number, clsId: string): Promise<void> {
    mutate(
        {cid: clsId, an: num},
        {
            onSuccess: () => {
                window.location.href = "/user/assignment";
            },
        },
    );
}

function goToLearningPathLink(): string | undefined {
    const assignment = assignmentQueryResult.data.value?.assignment;
    const lp = lpQueryResult.data.value;

    if (!assignment || !lp) return undefined;

    return `/learningPath/${lp.hruid}/${assignment.language}/${lp.startNode.learningobjectHruid}?assignmentNo=${props.assignmentId}&classId=${props.classId}`;
}

function goToGroupSubmissionLink(groupNo: number): string | undefined {
    const lp = lpQueryResult.data.value;
    if (!lp) return undefined;

    return `/learningPath/${lp.hruid}/${lp.language}/${lp.startNode.learningobjectHruid}?forGroup=${groupNo}&assignmentNo=${props.assignmentId}&classId=${props.classId}`;
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
                            :to="goToLearningPathLink()"
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
                                <GroupProgressRow
                                    :group-number="item.originalGroupNo"
                                    :learning-path="learningPath"
                                    :language="lang"
                                    :assignment-id="assignmentId"
                                    :class-id="classId"
                                />
                            </template>

                            <template #[`item.submission`]="{ item }">
                                <GroupSubmissionStatus
                                    :lp-hruid="learningPath"
                                    :group="item"
                                    :assignmentId="assignmentId"
                                    :class-id="classId"
                                    :language="lang"
                                    :go-to-group-submission-link="goToGroupSubmissionLink"
                                />
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
                            >Close
                            </v-btn
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
