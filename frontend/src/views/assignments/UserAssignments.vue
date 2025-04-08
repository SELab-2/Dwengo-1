<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import auth from "@/services/auth/auth-service.ts";
import {assignments} from "@/utils/tempData.ts";
import {useTeacherClassesQuery} from "@/queries/teachers.ts";
import {useStudentClassesQuery} from "@/queries/students.ts";
import {ClassController} from "@/controllers/classes.ts";
import type {ClassDTO} from "@dwengo-1/common/interfaces/class";
import {asyncComputed} from "@vueuse/core";

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

const classController = new ClassController();


const assignments = asyncComputed(async () => {
    const classes = classesQueryResults?.data?.value?.classes;
    if (!classes) return [];
    const result = await Promise.all(
        (classes as ClassDTO[]).map(async (cls) => {
            const { assignments } = await classController.getAssignments(cls.id);
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

console.log(assignments);


const goToCreateAssignment = async () => {
    await router.push('/assignment/create');
};

const goToAssignmentDetails = async (id: number, class_id: number) => {
    await router.push({
        path: `/assignment/${id}`,
        state: { class_id },
    });
};


const goToDeleteAssignment = (id: number) => {
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
                        <v-card-text class="card-content">
                            <div class="left-content">
                                <div class="assignment-title">{{ assignment.title }}</div>
                                <div class="assignment-class">
                                    {{ t('class') }}:
                                    <span class="class-name">
                                        {{ assignment.class.displayName }}
                                    </span>
                                </div>
                            </div>
                            <div class="right-content">
                                <v-card-actions>
                                    <v-btn color="primary" @click="goToAssignmentDetails(assignment.id, assignment.class.id)">
                                        {{ t('view-assignment') }}
                                    </v-btn>
                                    <v-btn v-if="isTeacher" color="red" @click="goToDeleteAssignment(assignment.id)">
                                        {{ t('delete') }}
                                    </v-btn>
                                </v-card-actions>
                            </div>
                        </v-card-text>
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
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.left-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 200px;
    max-width: 70%;
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

.right-content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-shrink: 0;
    flex-wrap: wrap;
    width: 100%;
}

@media (min-width: 700px) {
    .right-content {
        width: auto;
    }
}

</style>
