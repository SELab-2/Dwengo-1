<script setup lang="ts">
import {computed, defineProps} from "vue";
import {useI18n} from "vue-i18n";
import {AssignmentController, type AssignmentResponse} from "@/controllers/assignments.ts";
import {useAssignmentQuery} from "@/queries/assignments.ts";
import UsingQueryResult from "@/components/UsingQueryResult.vue";
import type {GroupDTO} from "@dwengo-1/common/interfaces/group";

const props = defineProps<{
    classId: string
    assignmentId: number
    groups: GroupDTO[] | undefined
}>();

const {t, locale} = useI18n();
const language = computed(() => locale.value);
const controller = new AssignmentController(props.classId);

const assignmentQueryResult = useAssignmentQuery(() => props.classId, props.assignmentId);

/***
 // Display group members
 const myGroup = computed(() => {
 if (!assignment.value || !assignment.value.groups) return null;
 console.log(assignment.value.groups)
 return assignment.value.groups.find(group =>
 group.members.some(m => m.username === myUsername)
 );
 });
 */

const deleteAssignment = async () => {
    await controller.deleteAssignment(props.assignmentId.value);
};

</script>

<template>
    <div class="container">
        <using-query-result
            :query-result="assignmentQueryResult"
            v-slot="{ data }: {data: AssignmentResponse}"
        >
            <v-card v-if="data" class="assignment-card">
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
                        @click="deleteAssignment"
                    >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </div>
                <v-card-title class="text-h4">{{ data.title }}</v-card-title>
                <v-card-subtitle class="subtitle-section">
                    <v-btn
                        :to="`/learningPath/${language}/${data.learningPath}`"
                        variant="tonal"
                        color="primary"
                    >
                        {{ t("learning-path") }}
                    </v-btn>
                </v-card-subtitle>

                <v-card-text class="description">
                    {{ data.description }}
                </v-card-text>

                <v-card-text class="group-section">
                    <h3>{{ t("group") }}</h3>

                    <!-- Teacher view
                    <div v-if="isTeacher">
                        <v-expansion-panels>
                            <v-expansion-panel
                                v-for="(group, index) in assignment.groups"
                                :key="group.id"
                            >
                                <v-expansion-panel-title>
                                    {{ t("group") }} {{ index + 1 }}
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <ul>
                                        <li v-for="student in group.members" :key="student.username">
                                            {{ student.firstName + ' ' + student.lastName }}
                                        </li>
                                    </ul>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </div>-->
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn
                        size="large"
                        color="success"
                        variant="text"
                    >
                        {{ t("view-submissions") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </using-query-result>
    </div>
</template>

<style scoped>
@import "@/assets/assignment.css";
</style>

