<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import { computed, onMounted, ref, watch } from "vue";
    import { assignmentTitleRules, classRules } from "@/utils/assignment-rules.ts";
    import auth from "@/services/auth/auth-service.ts";
    import { useTeacherClassesQuery } from "@/queries/teachers.ts";
    import { useRouter, useRoute } from "vue-router";
    import { useGetAllLearningPaths } from "@/queries/learning-paths.ts";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import type { LearningPath } from "@/data-objects/learning-paths/learning-path.ts";
    import type { ClassesResponse } from "@/controllers/classes.ts";
    import type { AssignmentDTO } from "@dwengo-1/common/interfaces/assignment";
    import { useCreateAssignmentMutation } from "@/queries/assignments.ts";

    const route = useRoute();
    const router = useRouter();
    const { t, locale } = useI18n();
    const role = ref(auth.authState.activeRole);
    const username = ref<string>("");

    onMounted(async () => {
        if (role.value === "student") {
            await router.push("/user");
        }
        const user = await auth.loadUser();
        username.value = user?.profile?.preferred_username ?? "";
    });

    const language = computed(() => locale.value);
    const form = ref();

    const learningPathsQueryResults = useGetAllLearningPaths(language);
    const classesQueryResults = useTeacherClassesQuery(username, true);

    const selectedClass = ref(undefined);
    const assignmentTitle = ref("");
    const selectedLearningPath = ref(route.query.hruid?.toString() || undefined);

    const lpIsSelected = route.query.hruid !== undefined;

    const { mutate, data, isSuccess } = useCreateAssignmentMutation();

    watch([isSuccess, data], async ([success, newData]) => {
        if (success && newData?.assignment) {
            await router.push(`/assignment/${newData.assignment.within}/${newData.assignment.id}`);
        }
    });

    async function submitFormHandler(): Promise<void> {
        const { valid } = await form.value.validate();
        if (!valid) return;

        const lp = lpIsSelected
            ? route.query.hruid
            : selectedLearningPath.value?.hruid;

        if (!lp) {
            return;
        }

        console.log('Form values:', {
            title: assignmentTitle.value,
            class: selectedClass.value,
            lp: selectedLearningPath.value
        });

        const assignmentDTO: AssignmentDTO = {
            id: 0,
            within: selectedClass.value?.id || "",
            title: assignmentTitle.value.toString(),
            description: "",
            learningPath: lp.toString(),
            language: language.value.toString(),
            deadline: null,
            groups: [],
        };

        mutate({ cid: assignmentDTO.within, data: assignmentDTO });
    }

    const learningPathRules = [
        (value: any) => {
            // Skip validation if LP is selected from query
            if (route.query.hruid) return true;
            // Original validation logic
            return Boolean(value) || 'Learning path is required';
        }
    ];
</script>

<template>
    <div class="main-container">
        <h1 class="h1">{{ t("new-assignment") }}</h1>

        <v-card class="form-card elevation-2 pa-6">
            <v-form
                ref="form"
                class="form-container"
                validate-on="submit lazy"
                @submit.prevent="submitFormHandler"
            >
                <v-container class="step-container pa-0">
                    <!-- Title field -->
                    <v-text-field
                        v-model="assignmentTitle"
                        :label="t('title')"
                        :rules="assignmentTitleRules"
                        density="comfortable"
                        variant="solo-filled"
                        prepend-inner-icon="mdi-format-title"
                        clearable
                        required
                    />

                    <!-- Learning Path keuze -->
                    <using-query-result
                        :query-result="learningPathsQueryResults"
                        v-slot="{ data }: { data: LearningPath[] }"
                    >
                        <v-combobox
                            v-model="selectedLearningPath"
                            :items="data"
                            :label="t('choose-lp')"
                            :rules="lpIsSelected ? [] : learningPathRules"
                            variant="solo-filled"
                            clearable
                            :model-value="lpIsSelected ? data.find(lp => lp.hruid === route.query.hruid?.toString()) : selectedLearningPath"
                            item-title="title"
                            item-value="hruid"
                            :disabled="lpIsSelected"
                            return-object
                        />
                    </using-query-result>

                    <!-- Klas keuze -->
                    <using-query-result
                        :query-result="classesQueryResults"
                        v-slot="{ data }: { data: ClassesResponse }"
                    >
                        <v-combobox
                            v-model="selectedClass"
                            :items="data?.classes ?? []"
                            :label="t('pick-class')"
                            :rules="classRules"
                            variant="solo-filled"
                            clearable
                            density="comfortable"
                            chips
                            hide-no-data
                            hide-selected
                            item-title="displayName"
                            item-value="id"
                            prepend-inner-icon="mdi-account-multiple"
                        />
                    </using-query-result>

                    <!-- Submit & Cancel -->
                    <v-divider class="my-6" />

                    <div class="d-flex justify-end ga-2">
                        <v-btn
                            color="primary"
                            type="submit"
                            size="small"
                            prepend-icon="mdi-check-circle"
                            elevation="1"
                        >
                            {{ t("submit") }}
                        </v-btn>

                        <v-btn
                            to="/user/assignment"
                            color="grey"
                            size="small"
                            variant="text"
                            prepend-icon="mdi-close-circle"
                        >
                            {{ t("cancel") }}
                        </v-btn>
                    </div>
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
        justify-content: start;
        padding-top: 32px;
        text-align: center;
    }

    .form-card {
        width: 100%;
        max-width: 720px;
        border-radius: 16px;
    }

    .form-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
        width: 100%;
    }

    .step-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    @media (max-width: 1000px) {
        .form-card {
            width: 85%;
            padding: 1%;
        }
    }

    @media (max-width: 600px) {
        h1 {
            font-size: 32px;
            text-align: center;
            margin-left: 0;
        }
    }

    @media (max-width: 400px) {
        h1 {
            font-size: 24px;
            text-align: center;
            margin-left: 0;
        }
    }

    .v-card {
        border: 2px solid #0e6942;
        border-radius: 12px;
    }
</style>
