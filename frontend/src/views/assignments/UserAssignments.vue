<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import auth from "@/services/auth/auth-service.ts";
import {useTeacherClassesQuery} from "@/queries/teachers.ts";
import {useStudentClassesQuery} from "@/queries/students.ts";
import {ClassController} from "@/controllers/classes.ts";
import type {ClassDTO} from "@dwengo-1/common/interfaces/class";
import {asyncComputed} from "@vueuse/core";
import {AssignmentController} from "@/controllers/assignments.ts";

const {t} = useI18n();
const router = useRouter();

const role = ref(auth.authState.activeRole);
const username = ref<string>("");

const isTeacher = computed(() => role.value === 'teacher');

// Fetch and store all the teacher's classes
let classesQueryResults = undefined;

if (isTeacher.value) {
    classesQueryResults = useTeacherClassesQuery(username, true)
} else {
    classesQueryResults = useStudentClassesQuery(username, true);
}

//TODO: replace with query from classes
const classController = new ClassController();

const assignments = asyncComputed(async () => {
    const classes = classesQueryResults?.data?.value?.classes;
    if (!classes) return [];
    const result = await Promise.all(
        (classes as ClassDTO[]).map(async (cls) => {
            //TODO: replace by class queries
            const {assignments} = await classController.getAssignments(cls.id);
            return assignments.map(a => ({
                id: a.id,
                class: cls, // replace by the whole ClassDTO object
                title: a.title,
                description: a.description,
                learningPath: a.learningPath,
                language: a.language,
                groups: []
            }));
        })
    );

    return result.flat();
}, []);


const goToCreateAssignment = async () => {
    await router.push('/assignment/create');
};

const goToAssignmentDetails = async (id: number, class_id: string) => {
    await router.push({
        path: `/assignment/${id}`,
        state: {class_id},
    });
};


const goToDeleteAssignment = async (id: number, class_id: string) => {
    //TODO: replace with query
    const controller = new AssignmentController(class_id);
    await controller.deleteAssignment(id);
};

onMounted(async () => {
    const user = await auth.loadUser();
    username.value = user?.profile?.preferred_username ?? "";
});
</script>

<template>
    <div class="assignments-container">
        <h1>{{ t('assignments') }}</h1>

        <v-btn
            v-if="isTeacher"
            color="primary"
            class="mb-4 center-btn"
            @click="goToCreateAssignment"
        >
            {{ t('new-assignment') }}
        </v-btn>

        <v-container>
            <v-row>
                <v-col
                    v-for="assignment in assignments"
                    :key="assignment.id"
                    cols="12"
                >
                    <v-card class="assignment-card">
                        <div class="top-content">
                            <div class="assignment-title">{{ assignment.title }}</div>
                            <div class="assignment-class">
                                {{ t('class') }}:
                                <span class="class-name">
                                      {{ assignment.class.displayName }}
                                    </span>
                            </div>
                        </div>

                        <div class="spacer"></div>

                        <div class="button-row">
                            <v-btn color="primary"
                                   variant="text"
                                   @click="goToAssignmentDetails(assignment.id, assignment.class.id)">
                                {{ t('view-assignment') }}
                            </v-btn>
                            <v-btn v-if="isTeacher" color="red"
                                   variant="text"
                                   @click="goToDeleteAssignment(assignment.id, assignment.class.id)">
                                {{ t('delete') }}
                            </v-btn>
                        </div>
                    </v-card>

                </v-col>
            </v-row>
        </v-container>
    </div>
</template>


<style scoped>
.assignments-container {
    width: 100%;
    margin: 0 auto;
    padding: 2% 4%;
    box-sizing: border-box;
}

.center-btn {
    display: block;
    margin-left: auto;
    margin-right: auto;
}


.assignment-card {
    padding: 1rem;
}

.card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 150px;
}

.top-content {
    margin-bottom: 1rem;
    word-break: break-word;
}

.spacer {
    flex: 1;
}

.button-row {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.assignment-title {
    font-weight: bold;
    font-size: 1.5rem;
    margin-bottom: 0.1rem;
    word-break: break-word;
}

.assignment-class {
    color: #666;
    font-size: 0.95rem;
}

.class-name {
    font-weight: 500;
    color: #333;
}


</style>
