<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useClassStudentsQuery} from "@/queries/classes";

const props = defineProps<{
    classId: string | undefined;
    groups: object[];
}>();
const emit = defineEmits(["close", "groupsUpdated", "done"]);
const {t} = useI18n();

interface StudentItem {
    username: string;
    fullName: string;
}

const {data: studentsData} = useClassStudentsQuery(() => props.classId, true);

// Dialog states for group editing
const activeDialog = ref<"random" | "dragdrop" | null>(null);

// Drag state for the drag and drop
const draggedItem = ref<{ groupIndex: number, studentIndex: number } | null>(null);

const currentGroups = ref<StudentItem[][]>([]);
const unassignedStudents = ref<StudentItem[]>([]);
const allStudents = ref<StudentItem[]>([]);

// Random groups state
const groupSize = ref(1);
const randomGroupsPreview = ref<StudentItem[][]>([]);

// Initialize data
watch(
    () => [studentsData.value, props.groups],
    ([studentsVal, existingGroups]) => {
        if (!studentsVal) return;

        // Initialize all students
        allStudents.value = studentsVal.students.map((s) => ({
            username: s.username,
            fullName: `${s.firstName} ${s.lastName}`,
        }));

        // Initialize groups if they exist
        if (existingGroups && existingGroups.length > 0) {
            currentGroups.value = existingGroups.map((group) =>
                group.members.map(member => ({
                    username: member.username,
                    fullName: `${member.firstName} ${member.lastName}`
                }))
            );
            const assignedUsernames = new Set(
                existingGroups.flatMap((g) => g.members.map((m: StudentItem) => m.username)),
            );
            unassignedStudents.value = allStudents.value.filter((s) => !assignedUsernames.has(s.username));
        } else {
            currentGroups.value = [];
            unassignedStudents.value = [...allStudents.value];
        }

        randomGroupsPreview.value = [...currentGroups.value];
    },
    {immediate: true},
);

/** Random groups functions */
function generateRandomGroups(): void {
    if (groupSize.value < 1) return;

    // Shuffle students
    const shuffled = [...allStudents.value].sort(() => Math.random() - 0.5);

    // Create new groups
    const newGroups: StudentItem[][] = [];
    const groupCount = Math.ceil(shuffled.length / groupSize.value);

    for (let i = 0; i < groupCount; i++) {
        newGroups.push([]);
    }

    // Distribute students
    shuffled.forEach((student, index) => {
        const groupIndex = index % groupCount;
        newGroups[groupIndex].push(student);
    });

    randomGroupsPreview.value = newGroups;
}

function saveRandomGroups(): void {
    if (randomGroupsPreview.value.length === 0) {
        alert(t("please-generate-groups-first"));
        return;
    }

    emit(
        "groupsUpdated",
        randomGroupsPreview.value.map((g) => g.map((s) => s.username)),
    );
    activeDialog.value = null;
    emit("done");
    emit("close");
}

function addNewGroup() {
    currentGroups.value.push([]);
}

function removeGroup(index: number) {
    // Move students back to unassigned
    unassignedStudents.value.push(...currentGroups.value[index]);
    currentGroups.value.splice(index, 1);
}

/** Drag and drop functions */

// Touch state interface
interface TouchState {
    isDragging: boolean;
    startX: number;
    startY: number;
    currentGroupIndex: number;
    currentStudentIndex: number;
    element: HTMLElement | null;
    clone: HTMLElement | null;
    originalRect: DOMRect | null;
    hasMoved: boolean;
}

const touchState = ref<TouchState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentGroupIndex: -1,
    currentStudentIndex: -1,
    element: null,
    clone: null,
    originalRect: null,
    hasMoved: false
});

function handleTouchStart(event: TouchEvent, groupIndex: number, studentIndex: number): void {
    if (event.touches.length > 1) return;

    const touch = event.touches[0];
    const target = event.target as HTMLElement;
    // Target the chip directly instead of the draggable container
    const chip = target.closest('.v-chip') as HTMLElement;

    if (!chip) return;

    // Get the chip's position relative to the viewport
    const rect = chip.getBoundingClientRect();

    touchState.value = {
        isDragging: true,
        startX: touch.clientX,
        startY: touch.clientY,
        currentGroupIndex: groupIndex,
        currentStudentIndex: studentIndex,
        element: chip,
        clone: null,
        originalRect: rect,
        hasMoved: false
    };

    // Clone only the chip
    const clone = chip.cloneNode(true) as HTMLElement;
    clone.classList.add('drag-clone');
    clone.style.position = 'fixed';
    clone.style.zIndex = '10000';
    clone.style.opacity = '0.9';
    clone.style.pointerEvents = 'none';
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.transform = 'scale(1.05)';
    clone.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    clone.style.transition = 'transform 0.1s';

    // Ensure the clone has the same chip styling
    clone.style.backgroundColor = getComputedStyle(chip).backgroundColor;
    clone.style.color = getComputedStyle(chip).color;
    clone.style.borderRadius = getComputedStyle(chip).borderRadius;
    clone.style.padding = getComputedStyle(chip).padding;
    clone.style.margin = '0'; // Remove any margin

    document.body.appendChild(clone);
    touchState.value.clone = clone;
    chip.style.visibility = 'hidden';

    event.preventDefault();
    event.stopPropagation();
}

function handleTouchMove(event: TouchEvent): void {
    if (!touchState.value.isDragging || !touchState.value.clone || event.touches.length > 1) return;

    const touch = event.touches[0];
    const clone = touchState.value.clone;

    const dx = Math.abs(touch.clientX - touchState.value.startX);
    const dy = Math.abs(touch.clientY - touchState.value.startY);

    if (dx > 5 || dy > 5) {
        touchState.value.hasMoved = true;
    }

    clone.style.left = `${touch.clientX - clone.offsetWidth / 2}px`;
    clone.style.top = `${touch.clientY - clone.offsetHeight / 2}px`;

    document.querySelectorAll('.group-box').forEach(el => {
        el.classList.remove('highlight');
    });

    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const dropTarget = elements.find(el => el.classList.contains('group-box'));

    if (dropTarget) {
        dropTarget.classList.add('highlight');
    }

    event.preventDefault();
    event.stopPropagation();
}

function handleTouchEnd(event: TouchEvent): void {
    if (!touchState.value.isDragging) return;

    const {
        currentGroupIndex,
        currentStudentIndex,
        clone,
        element,
        hasMoved
    } = touchState.value;

    document.querySelectorAll('.group-box').forEach(el => {
        el.classList.remove('highlight');
    });

    if (clone?.parentNode) {
        clone.parentNode.removeChild(clone);
    }

    if (element) {
        element.style.visibility = 'visible';
    }

    if (hasMoved && event.changedTouches.length > 0) {
        const touch = event.changedTouches[0];
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        const dropTarget = elements.find(el => el.classList.contains('group-box'));

        if (dropTarget) {
            const groupBoxes = document.querySelectorAll('.group-box');
            const targetGroupIndex = Array.from(groupBoxes).indexOf(dropTarget);

            if (targetGroupIndex !== currentGroupIndex) {
                const sourceArray = currentGroupIndex === -1
                    ? unassignedStudents.value
                    : currentGroups.value[currentGroupIndex];
                const targetArray = targetGroupIndex === -1
                    ? unassignedStudents.value
                    : currentGroups.value[targetGroupIndex];

                if (sourceArray && targetArray) {
                    const [movedStudent] = sourceArray.splice(currentStudentIndex, 1);
                    targetArray.push(movedStudent);
                }
            }
        }
    }

    touchState.value = {
        isDragging: false,
        startX: 0,
        startY: 0,
        currentGroupIndex: -1,
        currentStudentIndex: -1,
        element: null,
        clone: null,
        originalRect: null,
        hasMoved: false
    };

    event.preventDefault();
    event.stopPropagation();
}

function handleDragStart(event: DragEvent, groupIndex: number, studentIndex: number): void {
    draggedItem.value = {groupIndex, studentIndex};
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', '');
    }
}

function handleDragOver(e: DragEvent, _: number): void {
    e.preventDefault();
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "move";
    }
}

function handleDrop(e: DragEvent, targetGroupIndex: number, targetStudentIndex?: number): void {
    e.preventDefault();
    if (!draggedItem.value) return;

    const {groupIndex: sourceGroupIndex, studentIndex: sourceStudentIndex} = draggedItem.value;
    const sourceArray = sourceGroupIndex === -1
        ? unassignedStudents.value
        : currentGroups.value[sourceGroupIndex];
    const targetArray = targetGroupIndex === -1
        ? unassignedStudents.value
        : currentGroups.value[targetGroupIndex];

    const [movedStudent] = sourceArray.splice(sourceStudentIndex, 1);
    if (targetStudentIndex !== undefined) {
        targetArray.splice(targetStudentIndex, 0, movedStudent);
    } else {
        targetArray.push(movedStudent);
    }

    draggedItem.value = null;
}

function saveDragDrop(): void {
    if (unassignedStudents.value.length > 0) {
        alert(t("please-assign-all-students"));
        return;
    }

    emit(
        "groupsUpdated",
        currentGroups.value.map((g) => g.map((s) => s.username)),
    );
    activeDialog.value = null;
    emit("done");
    emit("close");
}

const showGroupsPreview = computed(() => {
    return currentGroups.value.length > 0 || unassignedStudents.value.length > 0;
});

function removeStudent(groupIndex: number, student: StudentItem): void {
    const group = currentGroups.value[groupIndex];
    currentGroups.value[groupIndex] = group.filter((s) => s.username !== student.username);
    unassignedStudents.value.push(student);
}
</script>

<template>
    <v-card class="pa-4">
        <!-- Current groups and unassigned students Preview -->
        <div v-if="showGroupsPreview" class="mb-6">
            <h3 class="mb-2">{{ t("current-groups") }}</h3>
            <div>
                <div class="d-flex flex-wrap">
                    <label>{{ currentGroups.length }}</label>
                </div>
            </div>

            <div v-if="unassignedStudents.length > 0" class="mt-3">
                <strong>{{ t("unassigned-students") }}:</strong>
                <div class="d-flex flex-wrap">
                    <label>{{ unassignedStudents.length }}</label>
                </div>
            </div>
        </div>

        <v-row justify="center" class="mb-4">
            <v-btn color="primary" @click="activeDialog = 'random'">
                {{ t("randomly-create-groups") }}
            </v-btn>
            <v-btn color="secondary" class="ml-4" @click="activeDialog = 'dragdrop'">
                {{ t("drag-and-drop") }}
            </v-btn>
        </v-row>

        <!-- Random Groups selection Dialog -->
        <v-dialog
            :model-value="activeDialog === 'random'"
            @update:model-value="(val) => (val ? (activeDialog = 'random') : (activeDialog = null))"
            max-width="600"
        >
            <v-card>
                <v-card-title>{{ t("randomly-create-groups") }}</v-card-title>
                <v-card-text>
                    <v-row align="center">
                        <v-col cols="6">
                            <v-text-field
                                v-model.number="groupSize"
                                type="number"
                                min="1"
                                :max="allStudents.length"
                                :label="t('group-size-label')"
                                dense
                            />
                        </v-col>
                        <v-col cols="6">
                            <v-btn
                                color="primary"
                                @click="generateRandomGroups"
                                :disabled="groupSize < 1 || groupSize > allStudents.length"
                                block
                            >
                                {{ t("generate-groups") }}
                            </v-btn>
                        </v-col>
                    </v-row>

                    <div class="mt-4">
                        <div class="d-flex justify-space-between align-center mb-2">
                            <strong>{{ t("preview") }}</strong>
                            <span class="text-caption"> {{ randomGroupsPreview.length }} {{ t("groups") }} </span>
                        </div>

                        <v-expansion-panels>
                            <v-expansion-panel
                                v-for="(group, index) in randomGroupsPreview"
                                :key="'random-preview-' + index"
                            >
                                <v-expansion-panel-title>
                                    {{ t("group") }} {{ index + 1 }} ({{ group.length }} {{ t("members") }})
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-chip
                                        v-for="student in group"
                                        :key="student.username"
                                        class="ma-1"
                                    >
                                        {{ student.fullName }}
                                    </v-chip>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer/>
                    <v-btn text @click="activeDialog = null">{{ t("cancel") }}</v-btn>
                    <v-btn
                        color="success"
                        @click="saveRandomGroups"
                        :disabled="randomGroupsPreview.length === 0"
                    >
                        {{ t("save") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Drag and Drop Dialog -->
        <v-dialog
            :model-value="activeDialog === 'dragdrop'"
            @update:model-value="(val) => (val ? (activeDialog = 'dragdrop') : (activeDialog = null))"
            max-width="900"
        >
            <v-card>
                <v-card-title class="d-flex justify-space-between align-center">
                    <div>{{ t("drag-and-drop") }}</div>
                    <v-btn color="primary" small @click="addNewGroup">+</v-btn>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <!-- Groups Column -->
                        <v-col cols="12" md="8">
                            <div v-if="currentGroups.length === 0" class="text-center py-4">
                                <v-alert type="info">{{ t("no-groups-yet") }}</v-alert>
                            </div>

                            <template v-else>
                                <div
                                    v-for="(group, groupIndex) in currentGroups"
                                    :key="groupIndex"
                                    class="mb-4"
                                    @dragover.prevent="handleDragOver($event, groupIndex)"
                                    @drop="handleDrop($event, groupIndex)"
                                >
                                    <div class="d-flex justify-space-between align-center mb-2">
                                        <strong>{{ t("group") }} {{ groupIndex + 1 }}</strong>
                                        <v-btn icon small color="error" @click="removeGroup(groupIndex)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </div>

                                    <div class="group-box pa-2">
                                        <div
                                            v-for="(student, studentIndex) in group"
                                            :key="student.username"
                                            class="draggable-item ma-1"
                                            draggable="true"
                                            @touchstart="handleTouchStart($event, groupIndex, studentIndex)"
                                            @touchmove="handleTouchMove($event)"
                                            @touchend="handleTouchEnd($event)"
                                            @dragstart="handleDragStart($event, groupIndex, studentIndex)"
                                            @dragover.prevent="handleDragOver($event, groupIndex)"
                                            @drop="handleDrop($event, groupIndex, studentIndex)"
                                        >
                                            <v-chip close @click:close="removeStudent(groupIndex, student)">
                                                {{ student.fullName }}
                                            </v-chip>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </v-col>

                        <!-- Unassigned Students Column -->
                        <v-col
                            cols="12"
                            md="4"
                            @dragover.prevent="handleDragOver($event, -1)"
                            @drop="handleDrop($event, -1)"
                        >
                            <div class="mb-2">
                                <strong>{{ t("unassigned") }}</strong>
                                <span class="text-caption ml-2">({{ unassignedStudents.length }})</span>
                            </div>

                            <div class="group-box pa-2">
                                <div
                                    v-for="(student, studentIndex) in unassignedStudents"
                                    :key="student.username"
                                    class="draggable-item ma-1"
                                    draggable="true"
                                    @touchstart="handleTouchStart($event, -1, studentIndex)"
                                    @touchmove="handleTouchMove($event)"
                                    @touchend="handleTouchEnd($event)"
                                    @dragstart="handleDragStart($event, -1, studentIndex)"
                                    @dragover.prevent="handleDragOver($event, -1)"
                                    @drop="handleDrop($event, -1, studentIndex)"
                                >
                                    <v-chip>{{ student.fullName }}</v-chip>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer/>
                    <v-btn text @click="activeDialog = null">{{ t("cancel") }}</v-btn>
                    <v-btn
                        color="primary"
                        @click="saveDragDrop"
                        :disabled="unassignedStudents.length > 0"
                    >
                        {{ t("save") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<style scoped>
.group-box {
    min-height: 100px;
    max-height: 200px;
    overflow-y: auto;
    background-color: #fafafa;
    border-radius: 4px;
    transition: all 0.2s;
}

.group-box.highlight {
    background-color: #e3f2fd;
    border: 2px dashed #2196f3;
}

.v-expansion-panel-text {
    max-height: 200px;
    overflow-y: auto;
}

.drag-clone {
    z-index: 10000;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transition: transform 0.1s;
    will-change: transform;
    pointer-events: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    background-color: inherit;
}

.draggable-item {
    display: inline-block;
}

.draggable-item .v-chip[style*="hidden"] {
    visibility: hidden;
    display: inline-block;
}
</style>
