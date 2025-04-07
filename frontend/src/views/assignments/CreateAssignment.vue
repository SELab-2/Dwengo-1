<script setup lang="ts">
    import {useI18n} from "vue-i18n";
    import {computed, onMounted, ref, watch} from "vue";
    import GroupSelector from "@/components/GroupSelector.vue";
    import {
        assignmentTitleRules,
        classRules,
        descriptionRules,
        learningPathRules,
        submitForm
    } from "@/utils/assignmentForm.ts";
    import DeadlineSelector from "@/components/DeadlineSelector.vue";
    import auth from "@/services/auth/auth-service.ts";
    import {useTeacherClassesQuery} from "@/queries/teachers.ts";
    import {useRouter} from "vue-router";
    import {useGetAllLearningPaths} from "@/queries/learning-paths.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import type {LearningPath} from "@/data-objects/learning-paths/learning-path.ts";
    import type {Language} from "@/data-objects/language.ts";

    const router = useRouter();
    const {t, locale} = useI18n();
    const role = ref(auth.authState.activeRole);
    const username = ref<string | null>(null);

    onMounted(async () => {
        // Redirect student
        if (role.value === 'student') {
            await router.push('/user');
        }

        // Get the user's username
        const user = await auth.loadUser();
        username.value = user?.profile?.preferred_username ?? null;
    });


    const language = computed(() => locale.value);
    //Fetch all learning paths
    const learningPathsQueryResults = useGetAllLearningPaths(language);

    watch(language, (newLanguage) => {
        console.log(newLanguage);
        learningPathsQueryResults.refetch();
    });

    // Fetch and store all the teacher's classes
    const { data: classes, isLoading, error, refetch } = useTeacherClassesQuery(username, true);
    const allClasses = computed(() => {
        if (isLoading.value) {
            return [];
        }
        if (error.value) {
            return [];
        }
        return classes.value?.classes || [];
    });


    const form = ref();

    const searchQuery = ref('');

    const assignmentTitle = ref('');
    const deadline = ref(null);
    const description = ref('');
    const allLearningPaths = ref([]);
    const selectedLearningPath = ref(null);
    const selectedClass = ref(null);
    const groups = ref<string[][]>([]);

    const availableClass = computed(() => {
        //TODO: replace by real data
        return /*classes.find(cl => selectedClass.value?.value === cl.id) ||*/ null;
    });

    const allStudents = computed(() => {
        //TODO: replace by real data
        /*if (!selectedClass.value) return [];
        const cl = classes.find(c => c.id === selectedClass.value.value);
        return cl ? cl.students.map(st => ({
            title: `${st.firstName} ${st.lastName}`,
            value: st.username,
            classes: cl
        })) : [];*/
        return [];
    });


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
        const { valid } = await form.value.validate();
        // Don't submit the form if all rules don't apply
        if (!valid) return;
        submitForm(assignmentTitle.value, selectedLearningPath.value?.hruid, selectedClass.value.value, groups.value, deadline.value, description.value, locale.value);
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
                                item-value="value"
                                required
                                :filter="(item, query: string) => item.title.toLowerCase().includes(query.toLowerCase())"
                            ></v-combobox>
                        </v-card-text>
                    </using-query-result>

                    <v-card-text>
                        <v-combobox
                            v-model="selectedClass"
                            :items="allClasses"
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

                    <DeadlineSelector v-model:deadline="deadline" />

                    <h3>{{ t('create-groups') }}</h3>

                    <GroupSelector
                        :students="allStudents"
                        :availableClass="availableClass"
                        :groups="groups"
                        @groupCreated="addGroupToList"
                    />

                    <!-- Counter for created groups -->
                    <v-card-text v-if="groups.length">
                        <strong>Created Groups: {{ groups.length }}</strong>
                    </v-card-text>

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

.title {
    margin-bottom: 1%;
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
