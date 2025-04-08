<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {computed, onMounted, ref, watch} from "vue";
import GroupSelector from "@/components/assignments/GroupSelector.vue";
import {assignmentTitleRules, classRules, descriptionRules, learningPathRules} from "@/utils/assignment-rules.ts";
import DeadlineSelector from "@/components/assignments/DeadlineSelector.vue";
import auth from "@/services/auth/auth-service.ts";
import {useTeacherClassesQuery} from "@/queries/teachers.ts";
import {useRouter} from "vue-router";
import {useGetAllLearningPaths} from "@/queries/learning-paths.ts";
import UsingQueryResult from "@/components/UsingQueryResult.vue";
import type {LearningPath} from "@/data-objects/learning-paths/learning-path.ts";
import type {ClassesResponse} from "@/controllers/classes.ts";
import type {AssignmentDTO} from "@dwengo-1/common/interfaces/assignment";
import {AssignmentController} from "@/controllers/assignments.ts";
import type {GroupDTO} from "@dwengo-1/common/interfaces/group";
import {GroupController} from "@/controllers/groups.ts";

/***
 TODO: when clicking the assign button from lp page pass the lp-object in a state:
 */
const props = defineProps<{
    learningPath?: LearningPath | null;  // Optional learningPath prop
}>();

const router = useRouter();
const {t, locale} = useI18n();
const role = ref(auth.authState.activeRole);
const username = ref<string>("");

async function submitForm(assignmentTitle: string,
                          selectedLearningPath: string,
                          selectedClass: string,
                          groups: string[][],
                          deadline: string,
                          description: string,
                          currentLanguage: string): Promise<void> {
    const assignmentDTO: AssignmentDTO = {
        id: 0,
        class: selectedClass,
        title: assignmentTitle,
        description: description,
        learningPath: selectedLearningPath,
        language: currentLanguage,
        groups: groups,
        //deadline: deadline,
    };

    //TODO: replace with query function
    const controller: AssignmentController = new AssignmentController(selectedClass);
    const response = await controller.createAssignment(assignmentDTO);
    // Create groups
    for (let i = 0; i < groups.length; i++) {
        const group: GroupDTO = {
            assignment: response.id,
            groupNumber: i,
            members: groups[i]
        };

        console.log("Posting group:", group);

        const groupController: GroupController = new GroupController(selectedClass, response.id);

        try {
            await groupController.createGroup(group);
            console.log("Group successfully posted:", group);
        } catch (err) {
            console.error("Group POST failed:", err);
        }
    }

    await router.push('/user/assignment');
}

onMounted(async () => {
    // Redirect student
    if (role.value === 'student') {
        await router.push('/user');
    }

    // Get the user's username
    const user = await auth.loadUser();
    username.value = user?.profile?.preferred_username ?? "";
});


const language = computed(() => locale.value);
const form = ref();
//Fetch all learning paths
const learningPathsQueryResults = useGetAllLearningPaths(language);

// Fetch and store all the teacher's classes
const classesQueryResults = useTeacherClassesQuery(username, true);

const selectedClass = ref(undefined);

const assignmentTitle = ref('');
const selectedLearningPath = ref<LearningPath | null>(props.learningPath ?? null);
// Disable combobox when learningPath prop is passed
const isLearningPathSelected = props.learningPath !== null;
const deadline = ref(null);
const description = ref('');
const groups = ref<string[][]>([]);

// New group is added to the list
const addGroupToList = (students: string[]) => {
    if (students.length) {
        groups.value = [...groups.value, students];
    }
};

watch(selectedClass, () => {
    groups.value = [];
});

const submitFormHandler = async () => {
    const {valid} = await form.value.validate();
    // Don't submit the form if all rules don't apply
    if (!valid) return;
    await submitForm(assignmentTitle.value, selectedLearningPath.value?.hruid, selectedClass.value.id, groups.value, deadline.value, description.value, locale.value);
};
</script>


<template>
    <div class="main-container">
        <h1 class="title">{{ t("new-assignment") }}</h1>
        <v-card class="form-card">
            <v-form ref="form" class="form-container" validate-on="submit lazy" @submit.prevent="submitFormHandler">
                <v-container class="step-container">
                    <v-card-text>
                        <v-text-field v-model="assignmentTitle" :label="t('title')" :rules="assignmentTitleRules"
                                      density="compact" variant="outlined" clearable required></v-text-field>
                    </v-card-text>

                    <using-query-result
                        :query-result="learningPathsQueryResults"
                        v-slot="{ data }: { data: LearningPath[] }"
                    >
                        <v-card-text>
                            <v-combobox
                                v-model="selectedLearningPath"
                                :items="data"
                                :label="t('choose-lp')"
                                :rules="learningPathRules"
                                variant="outlined"
                                clearable
                                hide-details
                                density="compact"
                                append-inner-icon="mdi-magnify"
                                item-title="title"
                                item-value="hruid"
                                required
                                :disabled="isLearningPathSelected"
                                :filter="(item, query: string) => item.title.toLowerCase().includes(query.toLowerCase())"
                            ></v-combobox>
                        </v-card-text>
                    </using-query-result>

                    <using-query-result
                        :query-result="classesQueryResults"
                        v-slot="{ data }: {data: ClassesResponse}"
                    >
                        <v-card-text>
                            <v-combobox
                                v-model="selectedClass"
                                :items="data?.classes ?? []"
                                :label="t('pick-class')"
                                :rules="classRules"
                                variant="outlined"
                                clearable
                                hide-details
                                density="compact"
                                append-inner-icon="mdi-magnify"
                                item-title="displayName"
                                item-value="id"
                                required
                            ></v-combobox>
                        </v-card-text>
                    </using-query-result>

                    <GroupSelector
                        :classId="selectedClass?.id"
                        :groups="groups"
                        @groupCreated="addGroupToList"
                    />

                    <!-- Counter for created groups -->
                    <v-card-text v-if="groups.length">
                        <strong>Created Groups: {{ groups.length }}</strong>
                    </v-card-text>
                    <DeadlineSelector v-model:deadline="deadline"/>
                    <v-card-text>
                        <v-textarea
                            v-model="description"
                            :label="t('description')"
                            variant="outlined"
                            density="compact"
                            auto-grow
                            rows="3"
                            :rules="descriptionRules"
                        ></v-textarea>
                    </v-card-text>
                    <v-btn class="mt-2" color="secondary" type="submit" block>Submit</v-btn>
                </v-container>
            </v-form>
        </v-card>
    </div>
</template>

<style scoped>
.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.form-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 55%;
    /*padding: 1%;*/
}

.form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.step-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    min-height: 200px;
}

@media (max-width: 1000px) {
    .form-card {
        width: 70%;
        padding: 1%;
    }

    .step-container {
        min-height: 300px;
    }
}

@media (max-width: 650px) {
    .form-card {
        width: 95%;
    }
}
</style>
