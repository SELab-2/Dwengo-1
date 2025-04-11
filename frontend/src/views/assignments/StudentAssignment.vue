<script setup lang="ts">
import { useRoute } from "vue-router";
import {ref, computed} from "vue";
import {useI18n} from "vue-i18n";
import {AssignmentController} from "@/controllers/assignments.ts";
import {asyncComputed} from "@vueuse/core";


const {t, locale} = useI18n();
const language = computed(() => locale.value);
const route = useRoute();
const assignmentId = ref(Number(route.params.id));
const classId = window.history.state?.class_id;
const controller = new AssignmentController(classId);

const assignment = asyncComputed(async () => {
    return await controller.getByNumber(assignmentId.value)
}, null);

const submitted = ref(true);//TODO: update by fetching submissions and check group

const submitAssignment = async () => {
    //TODO
};


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

</script>

<template>
    <div class="container">
        <v-card v-if="assignment" class="assignment-card">
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
                    class="ma-2 top-right-btn"
                    label
                    color="success"
                >
                    {{ t("submitted") }}
                </v-chip>
            </div>
            <v-card-title class="text-h4">{{ assignment.title }}</v-card-title>
            <v-card-subtitle class="subtitle-section">
                <v-btn
                    :to="`/learningPath/${language}/${assignment.learningPath}`"
                    variant="tonal"
                    color="primary"
                >
                    {{ t("learning-path") }}
                </v-btn>
            </v-card-subtitle>

            <v-card-text class="description">
                {{ assignment.description }}
            </v-card-text>

            <v-card-text class="group-section">
                <h3>{{ t("group") }}</h3>

                <!-- Student view
                <div v-if="!isTeacher">
                    <div v-if="myGroup">
                        <ul>
                            <li v-for="student in myGroup.members" :key="student.username">
                                {{ student.firstName + ' ' + student.lastName}}
                            </li>
                        </ul>
                    </div>
                </div>-->

            </v-card-text >
            <v-card-actions class="justify-end">
                <v-btn
                    size="large"
                    color="success"
                    variant="flat"
                    @click="submitAssignment"
                >
                    {{ t("submit") }}
                </v-btn>
            </v-card-actions>

        </v-card>
    </div>
</template>

<style scoped>
@import "@/assets/assignment.css";

</style>

