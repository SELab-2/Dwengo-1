<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import { computed, onMounted, ref, watch } from "vue";
    import GroupSelector from "@/components/assignments/GroupSelector.vue";
    import { assignmentTitleRules, classRules, descriptionRules, learningPathRules } from "@/utils/assignment-rules.ts";
    import DeadlineSelector from "@/components/assignments/DeadlineSelector.vue";
    import auth from "@/services/auth/auth-service.ts";
    import { useTeacherClassesQuery } from "@/queries/teachers.ts";
    import { useRouter } from "vue-router";
    import { useGetAllLearningPaths } from "@/queries/learning-paths.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
    import type { ClassesResponse } from "@/controllers/classes.ts";
    import type { AssignmentDTO } from "@dwengo-1/common/interfaces/assignment";
    import { useCreateAssignmentMutation } from "@/queries/assignments.ts";
    import { useRoute } from "vue-router";
    import {AccountType} from "@dwengo-1/common/util/account-types";

    const route = useRoute();
    const router = useRouter();
    const { t, locale } = useI18n();
    const role = ref(auth.authState.activeRole);
    const username = ref<string>("");

    onMounted(async () => {
        // Redirect student
        if (role.value === AccountType.Student) {
            await router.push("/user");
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

    const assignmentTitle = ref("");
    const selectedLearningPath = ref(route.query.hruid || undefined);

    // Disable combobox when learningPath prop is passed
    const lpIsSelected = route.query.hruid !== undefined;
    const deadline = ref(null);
    const description = ref("");
    const groups = ref<string[][]>([]);

    // New group is added to the list
    function addGroupToList(students: string[]): void {
        if (students.length) {
            groups.value = [...groups.value, students];
        }
    }

    watch(selectedClass, () => {
        groups.value = [];
    });

    const { mutate, data, isSuccess } = useCreateAssignmentMutation();

    watch([isSuccess, data], async ([success, newData]) => {
        if (success && newData?.assignment) {
            await router.push(`/assignment/${newData.assignment.within}/${newData.assignment.id}`);
        }
    });

    async function submitFormHandler(): Promise<void> {
        const { valid } = await form.value.validate();
        if (!valid) return;

        let lp = selectedLearningPath.value;
        if (!lpIsSelected) {
            lp = selectedLearningPath.value?.hruid;
        }

        const assignmentDTO: AssignmentDTO = {
            id: 0,
            within: selectedClass.value?.id || "",
            title: assignmentTitle.value,
            description: description.value,
            learningPath: lp || "",
            language: language.value,
            groups: groups.value,
        };

        mutate({ cid: assignmentDTO.within, data: assignmentDTO });
    }
</script>

<template>
    <div class="main-container">
        <h1 class="title">{{ t("new-assignment") }}</h1>
        <v-card class="form-card">
            <v-form
                ref="form"
                class="form-container"
                validate-on="submit lazy"
                @submit.prevent="submitFormHandler"
            >
                <v-container class="step-container">
                    <v-card-text>
                        <v-text-field
                            v-model="assignmentTitle"
                            :label="t('title')"
                            :rules="assignmentTitleRules"
                            density="compact"
                            variant="outlined"
                            clearable
                            required
                        ></v-text-field>
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
                                :disabled="lpIsSelected"
                                :filter="
                                    (item, query: string) => item.title.toLowerCase().includes(query.toLowerCase())
                                "
                            ></v-combobox>
                        </v-card-text>
                    </using-query-result>

                    <using-query-result
                        :query-result="classesQueryResults"
                        v-slot="{ data }: { data: ClassesResponse }"
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
                    <DeadlineSelector v-model:deadline="deadline" />
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
                    <v-card-text>
                        <v-btn
                            class="mt-2"
                            color="secondary"
                            type="submit"
                            block
                            >{{ t("submit") }}
                        </v-btn>
                        <v-btn
                            to="/user/assignment"
                            color="grey"
                            block
                            >{{ t("cancel") }}
                        </v-btn>
                    </v-card-text>
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
