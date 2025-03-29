<script setup lang="ts">
    import {useI18n} from "vue-i18n";
    import {computed, onMounted, ref, watch} from "vue";
    import GroupSelector from "@/components/GroupSelector.vue";
    import {classes} from "@/utils/tempData.ts";
    import {assignmentTitleRules, classesRules, learningPathRules, submitForm} from "@/utils/assignmentForm.ts";  // Assuming your tempData.ts has the required classes

    const {t, locale} = useI18n();

    const language = ref(locale.value);

    const searchQuery = ref('');

    const assignmentTitle = ref('');
    const allLearningPaths = ref([]);
    const filteredLearningPaths = ref([]);
    const selectedLearningPath = ref(null);
    const allClasses = ref([...classes.map(cl => ({title: cl.displayName, value: cl.id}))]);
    const selectedClasses = ref([]);
    const groups = ref<string[][]>([]);

    const availableClasses = computed(() => {
        //TODO: replace by real data
        return classes.filter(cl => selectedClasses.value.some(c => c.value === cl.id));
    });

    const allStudents = computed(() => {
        //TODO: replace by real data
        return classes
            .filter(cl => selectedClasses.value.some(c => c.value === cl.id))
            .flatMap(cl => cl.students.map(st => ({
                title: `${st.firstName} ${st.lastName}`,
                value: st.username,
                classes: cl
            })));
    });


    // New group is added to the list
    const addGroupToList = (students: string[]) => {
        if (students.length) {
            groups.value = [...groups.value, students];
        }
    };

    async function fetchAllLearningPaths() {
        try {
            //TODO: replace by function from controller
            const response = await fetch(`http://localhost:3000/api/learningPath?language=${language.value}`);
            if (!response.ok) throw new Error("Failed to fetch learning paths");
            const data = await response.json();
            allLearningPaths.value = data.map((lp: { hruid: string; title: string }) => ({
                hruid: lp.hruid,
                title: lp.title
            }));
            filteredLearningPaths.value = [...allLearningPaths.value];
        } catch (error) {
            console.error(error);
        }
    }

    watch(
        () => locale.value,
        (newLocale) => {
            if (!["nl", "en"].includes(newLocale)) {
                language.value = "en";
            }
            fetchAllLearningPaths();
        },
        {immediate: true}
    );

    const searchResults = computed(() => {
        return filteredLearningPaths.value.filter((lp: { hruid: string; title: string }) =>
            lp.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    });

    onMounted(fetchAllLearningPaths);

    const submitFormHandler = () => {
        submitForm(assignmentTitle.value, selectedLearningPath.value, selectedClasses.value, groups.value);
    };
</script>


<template>
    <div class="main-container">
        <h1 class="title">{{ t("new-assignment") }}</h1>
        <v-card class="form-card">
            <v-form class="form-container" validate-on="submit lazy" @submit.prevent="submitFormHandler">
                <v-container class="step-container">
                    <v-card-text>
                        <v-text-field :v-model="assignmentTitle" :label="t('title')" :rules="assignmentTitleRules"
                                      density="compact" variant="solo" clearable required></v-text-field>
                    </v-card-text>

                    <v-card-text>
                        <v-combobox
                            v-model="selectedLearningPath"
                            :items="searchResults"
                            :label="t('choose-lp')"
                            :rules="learningPathRules"
                            variant="solo"
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

                    <v-card-text>
                        <v-combobox
                            v-model="selectedClasses"
                            :items="allClasses"
                            :label="t('choose-classes')"
                            :rules="classesRules"
                            variant="solo"
                            clearable
                            multiple
                            hide-details
                            density="compact"
                            chips
                            append-inner-icon="mdi-magnify"
                            item-title="title"
                            item-value="value"
                            required
                        ></v-combobox>
                    </v-card-text>

                    <h3>{{ t('create-groups') }}</h3>

                    <GroupSelector
                        :students="allStudents"
                        :availableClasses="availableClasses"
                        :groups="groups"
                        @groupCreated="addGroupToList"
                    />

                    <!-- Counter for created groups -->
                    <v-card-text v-if="groups.length">
                        <strong>Created Groups: {{ groups.length }}</strong>
                    </v-card-text>

                </v-container>
                <v-btn class="mt-2" type="submit" block>Submit</v-btn>
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
    height: 100vh;
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

/* Responsive adjustments */
@media (max-width: 1000px) {
    .form-card {
        width: 70%;
        padding: 1%;
    }

    .step-container {
        min-height: 300px; /* Gives enough space */
    }
}

/* Responsive adjustments */
@media (max-width: 700px) {
    .form-card {
        width: 95%;
    }
}
</style>
