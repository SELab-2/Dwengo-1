<script setup lang="ts">
    import {useI18n} from "vue-i18n";
    import {computed, onMounted, ref, watch} from "vue";
    import GroupSelector from "@/components/GroupSelector.vue";

    const {t, locale} = useI18n();

    const language = ref(locale.value);

    const searchQuery = ref("");

    const allLearningPaths = ref([]);
    const filteredLearningPaths = ref([]);
    const selectedLearningPath = ref(null);
    const allClasses = ref(["f", "r"]);
    const selectedClasses = ref([]);
    const allStudents = ref([]); // Fetched students from each selected class
    const groups = ref<string[][]>([]);  // Each group is a list of student {names, id's}

    // Fetch all learning paths initially
    async function fetchAllLearningPaths() {
        //TODO: replace by function from controller
        try {
            const response = await fetch(`http://localhost:3000/api/learningPath?language=${language.value}`);

            // Error
            if (!response.ok) throw new Error("Failed to fetch learning paths");

            // Collect all the learning paths and store them in a list by hruid and title
            const data = await response.json();
            allLearningPaths.value = data.map((lp: { hruid: string; title: string }) => ({
                hruid: lp.hruid,
                title: lp.title
            }));

            // Get all the learning paths in the filtered list
            filteredLearningPaths.value = [...allLearningPaths.value];
        } catch (error) {
            console.error(error);
        }
    }

    // Re-fetch the learning paths when the language changes
    watch(
        () => locale.value,
        (newLocale) => {
            // Check if the language is valid
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

    // Fetch all learning paths on mount
    onMounted(fetchAllLearningPaths);

    // All students that aren't already in a group
    const availableStudents = computed(() => {
        const groupedStudents = new Set(groups.value.flat());
        return allStudents.value.filter(student => !groupedStudents.has(student));
    });

    const addGroupToList = (students: string[]) => {
        if (students.length) {
            groups.value.push(students);
        }
    };

</script>

<template>
    <div class="main-container">
        <h1 class="title">{{ t("new-assignment") }}</h1>
        <v-card class="form-card">
            <v-form class="form-container">
                <v-container class="step-container">
                    <v-card-text>
                        <v-combobox
                            v-model="selectedLearningPath"
                            :items="searchResults"
                            :label="t('choose-lp')"
                            variant="solo"
                            clearable
                            hide-details
                            density="compact"
                            append-inner-icon="mdi-magnify"
                            item-title="title"
                            item-value="value"
                            :filter="(item, query: string) => item.title.toLowerCase().includes(query.toLowerCase())"
                        ></v-combobox>
                    </v-card-text>

                    <v-card-text>
                        <v-combobox
                            v-model="selectedClasses"
                            :items="allClasses"
                            :label="t('choose-classes')"
                            variant="solo"
                            clearable
                            multiple
                            hide-details
                            chips
                            append-inner-icon="mdi-magnify"
                            item-title="title"
                            item-value="value"
                        ></v-combobox>
                    </v-card-text>

                    <v-container>
                        <h3>{{ t('create-groups') }}</h3>

                        <GroupSelector
                            :students="availableStudents"
                            @groupCreated="addGroupToList"
                        />

                        <!-- Counter for created groups -->
                        <v-card-text v-if="groups.length">
                            <strong>{{ t('created-groups') }}: {{ groups.length }}</strong>
                        </v-card-text>

                        <!-- Display created groups -->
                        <v-card-text v-if="groups.length">
                            <ul>
                                <li v-for="(group, index) in groups" :key="index">
                                    {{ group.join(', ') }}
                                </li>
                            </ul>
                        </v-card-text>
                    </v-container>

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
