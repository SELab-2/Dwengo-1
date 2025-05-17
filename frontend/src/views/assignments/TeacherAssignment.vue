<script setup lang="ts">
import {computed, ref, watch, watchEffect} from "vue";
import {useI18n} from "vue-i18n";
import {
    useAssignmentQuery,
    useDeleteAssignmentMutation,
    useUpdateAssignmentMutation,
} from "@/queries/assignments.ts";
import UsingQueryResult from "@/components/UsingQueryResult.vue";
import {useGroupsQuery} from "@/queries/groups.ts";
import {useGetLearningPathQuery} from "@/queries/learning-paths.ts";
import type {Language} from "@/data-objects/language.ts";
import type {AssignmentResponse} from "@/controllers/assignments.ts";
import type {GroupDTO, GroupDTOId} from "@dwengo-1/common/interfaces/group";
import GroupSubmissionStatus from "@/components/GroupSubmissionStatus.vue";
import GroupProgressRow from "@/components/GroupProgressRow.vue";
import type {AssignmentDTO} from "@dwengo-1/common/dist/interfaces/assignment.ts";
import GroupSelector from "@/components/assignments/GroupSelector.vue";
import DeadlineSelector from "@/components/assignments/DeadlineSelector.vue";

const props = defineProps<{
    classId: string;
    assignmentId: number;
}>();

const isEditing = ref(false);

const {t} = useI18n();
const lang = ref();
const groups = ref<GroupDTO[] | GroupDTOId[]>([]);
const learningPath = ref();
const form = ref();

const editingLearningPath = ref(learningPath);
const description = ref("");
const deadline = ref<Date | null>(null);
const editGroups = ref(false);

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
    const assignment = assignmentQueryResult.data.value?.assignment;
    if (assignment) {
        learningPath.value = assignment.learningPath;
        lang.value = assignment.language as Language;
        deadline.value = assignment.deadline ? new Date(assignment.deadline) : null;

        if (lpQueryResult.data.value) {
            editingLearningPath.value = lpQueryResult.data.value;
        }
    }
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
        originalGroupNo: group.groupNumber, // Keep original number if needed
    }));
});

const dialog = ref(false);
const selectedGroup = ref({});

function openGroupDetails(group: object): void {
    selectedGroup.value = group;
    dialog.value = true;
}


async function deleteAssignment(num: number, clsId: string): Promise<void> {
    const {mutate} = useDeleteAssignmentMutation();
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

const {mutate, data, isSuccess} = useUpdateAssignmentMutation();

watch([isSuccess, data], async ([success, newData]) => {
    if (success && newData?.assignment) {
        await assignmentQueryResult.refetch();
    }
});

async function saveChanges(): Promise<void> {
    const {valid} = await form.value.validate();
    if (!valid) return;

    isEditing.value = false;

    const assignmentDTO: AssignmentDTO = {
        description: description.value,
        deadline: deadline.value ?? null,
    };

    mutate({
        cid: assignmentQueryResult.data.value?.assignment.within,
        an: assignmentQueryResult.data.value?.assignment.id,
        data: assignmentDTO,
    });
}

async function handleGroupsUpdated(updatedGroups: string[][]): Promise<void> {
    const assignmentDTO: AssignmentDTO = {
        groups: updatedGroups,
    };
    mutate({
        cid: assignmentQueryResult.data.value?.assignment.within,
        an: assignmentQueryResult.data.value?.assignment.id,
        data: assignmentDTO,
    });
}

</script>

<template>
    <div class="container">
        <using-query-result
            :query-result="assignmentQueryResult"
            v-slot="assignmentResponse: { data: AssignmentResponse }"
        >
            <v-container
                fluid
                class="ma-4"
            >
                <v-row
                    no-gutters
                    class="custom-breakpoint"
                >
                    <v-col
                        cols="12"
                        sm="6"
                        md="6"
                        class="responsive-col"
                    >
                        <v-form
                            ref="form"
                            validate-on="submit lazy"
                            @submit.prevent="saveChanges"
                        >
                            <v-card
                                v-if="assignmentResponse"
                                class="assignment-card"
                            >
                                <div class="top-buttons">
                                    <div class="top-buttons-wrapper">
                                        <v-btn
                                            icon
                                            variant="text"
                                            class="back-btn"
                                            to="/user/assignment"
                                        >
                                            <v-icon>mdi-arrow-left</v-icon>
                                        </v-btn>
                                        <div class="right-buttons">
                                            <v-btn
                                                v-if="!isEditing"
                                                icon
                                                variant="text"
                                                class="top_next_to_right_button"
                                                @click="
                                                    () => {
                                                        isEditing = true;
                                                        description = assignmentResponse.data.assignment.description;
                                                    }
                                                "
                                            >
                                                <v-icon>mdi-pencil</v-icon>
                                            </v-btn>
                                            <v-btn
                                                v-else
                                                variant="text"
                                                class="top-right-btn"
                                                @click="
                                                    () => {
                                                        isEditing = false;
                                                        editingLearningPath = learningPath;
                                                    }
                                                "
                                            >{{ t("cancel") }}
                                            </v-btn>

                                            <v-btn
                                                v-if="!isEditing"
                                                icon
                                                variant="text"
                                                class="top-right-btn"
                                                @click="
                                                    deleteAssignment(
                                                        assignmentResponse.data.assignment.id,
                                                        assignmentResponse.data.assignment.within,
                                                    )
                                                "
                                            >
                                                <v-icon>mdi-delete</v-icon>
                                            </v-btn>
                                            <v-btn
                                                v-else
                                                icon
                                                variant="text"
                                                class="top_next_to_right_button"
                                                @click="saveChanges"
                                            >
                                                <v-icon>mdi-content-save-edit-outline</v-icon>
                                            </v-btn>
                                        </div>
                                    </div>
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
                                            :to="goToLearningPathLink()"
                                            variant="tonal"
                                            color="primary"
                                            :disabled="isEditing"
                                        >
                                            {{ t("learning-path") }}
                                        </v-btn>
                                        <v-alert
                                            v-else
                                            type="info"
                                        >
                                            {{ t("no-learning-path-selected") }}
                                        </v-alert>
                                    </using-query-result>
                                </v-card-subtitle>
                                <v-card-text v-if="isEditing">
                                    <deadline-selector
                                        v-model:deadline="deadline"
                                    />
                                </v-card-text>
                                <v-card-text
                                    v-if="!isEditing"
                                    class="description"
                                >
                                    {{ assignmentResponse.data.assignment.description }}
                                </v-card-text>
                                <v-card-text v-else>
                                    <v-textarea
                                        v-model="description"
                                        :label="t('description')"
                                        variant="outlined"
                                        density="compact"
                                        auto-grow
                                        rows="3"
                                    ></v-textarea>
                                </v-card-text>
                            </v-card>
                        </v-form>

                        <!-- A pop up to show group members -->
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
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-col>

                    <!-- The second column of the screen -->
                    <v-col
                        cols="12"
                        sm="6"
                        md="6"
                        class="responsive-col"
                    >
                        <div class="table-container">
                            <v-table class="table">
                                <thead>
                                <tr>
                                    <th class="header">{{ t("group") }}</th>
                                    <th class="header">{{ t("progress") }}</th>
                                    <th class="header">{{ t("submission") }}</th>
                                    <th class="header">
                                        <v-btn
                                            @click="editGroups = true"
                                            variant="text"
                                        >
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr
                                    v-for="g in allGroups"
                                    :key="g.originalGroupNo"
                                >
                                    <td>
                                        <v-btn
                                            @click="openGroupDetails(g)"
                                            variant="text"
                                        >
                                            {{ g.name }}
                                            <v-icon end>mdi-menu-right</v-icon>
                                        </v-btn>
                                    </td>

                                    <td>
                                        <GroupProgressRow
                                            :group-number="g.originalGroupNo"
                                            :learning-path="learningPath"
                                            :language="lang"
                                            :assignment-id="assignmentId"
                                            :class-id="classId"
                                        />
                                    </td>

                                    <td>
                                        <GroupSubmissionStatus
                                            :group="g"
                                            :assignment-id="assignmentId"
                                            :class-id="classId"
                                            :language="lang"
                                            :go-to-group-submission-link="goToGroupSubmissionLink"
                                        />
                                    </td>

                                    <!-- Edit icon -->
                                    <td>
                                        <v-btn
                                            @click=""
                                            variant="text"
                                        >
                                            <v-icon color="red">mdi-delete</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                                </tbody>
                            </v-table>
                        </div>
                    </v-col>
                </v-row>
                <v-dialog
                    v-model="editGroups"
                    max-width="800"
                    persistent
                >
                    <v-card>
                        <v-card-text>
                            <GroupSelector
                                :groups="allGroups"
                                :class-id="props.classId"
                                :assignment-id="props.assignmentId"
                                @groupsUpdated="handleGroupsUpdated"
                                @close="editGroups = false"
                            />
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                                text
                                @click="editGroups = false"
                            >{{ t("cancel") }}
                            </v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-container>
        </using-query-result>
    </div>
</template>

<style scoped>
@import "@/assets/assignment.css";

.table-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

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

.table-container {
    width: 100%;
    overflow-x: visible;
}

.table {
    width: 100%;
    min-width: auto;
    table-layout: auto;
}

@media screen and (max-width: 850px) {
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

    .custom-breakpoint {
        flex-direction: column !important;
    }

    .table {
        width: 100%;
        display: block;
        overflow-x: auto;
    }

    .table-container {
        overflow-x: auto;
    }

    .responsive-col {
        max-width: 100% !important;
        flex-basis: 100% !important;
    }
}
</style>
