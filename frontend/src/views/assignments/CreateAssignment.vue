<script setup lang="ts">
    import {useI18n} from "vue-i18n";
    import {computed, onMounted, ref, shallowRef, watch} from "vue";
    import {THEMESITEMS} from "@/utils/constants.ts";

    const {t, locale} = useI18n();

    const step = ref(1);

    const language = ref(locale.value);

    // If this value is set to true, the search bar will display a "loading" animation
    const loading = ref(false);
    const searchQuery = ref("");

    // These lists store all available and selected themes
    const themeItems = ref(Object.keys(THEMESITEMS).slice(1));
    const selectedThemes = shallowRef<string[]>([]);

    // Store all learning paths
    const allLearningPaths = ref([]);

    // Filtered learning paths that will be displayed in the search bar dropdown
    const filteredLearningPaths = ref([]);

    // The hruid and title of the currently selected learning path(TODO: use for post req)
    const selectedLearningPath = ref(null);


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

    watch(
        () => locale.value,
        (newLocale) => {
            // Check if the language is valid
            if (!["nl", "en"].includes(newLocale)) {
                language.value = "en";
            }
            fetchAllLearningPaths(); // Re-fetch the learning path data when language changes
        },
        { immediate: true }
    );

    // Filter the learning paths based on selected themes
    async function filterLearningPathsByThemes() {
        if (selectedThemes.value.length === 0) {
            // Show all the learning paths if no themes are selected
            filteredLearningPaths.value = [...allLearningPaths.value];
            return;
        }

        const learningPathHruids = new Set();

        // Collect all themes categories that are selected
        const themeCategories = new Set();
        selectedThemes.value.forEach(theme => {
            THEMESITEMS[theme]?.forEach(category => themeCategories.add(category));
        });

        //TODO: replace by function from controller
        try {
            // Fetch all theme data in parallel and wait for all to complete
            const responses = await Promise.all(
                Array.from(themeCategories).map(category =>
                    fetch(`http://localhost:3000/api/theme/${category}?language=${language.value}`)
                        .then(response => {
                            if (!response.ok) throw new Error(`Error fetching ${category}`);
                            return response.json();
                        })
                        .catch(error => {
                            console.error(error);
                            return []; // Return empty array on failure
                        })
                )
            );

            // Combine all received hruids and add them in a set
            responses.forEach(data => {
                data.forEach((lp: string ) => learningPathHruids.add(lp));
            });


            // Update filteredLearningPaths only after all requests complete
            filteredLearningPaths.value = allLearningPaths.value.filter(lp =>
                learningPathHruids.has(lp.hruid)
            );

        } catch (error) {
            console.error("Error fetching themes:", error);
        }
    }

    const searchResults = computed(() => {
        return filteredLearningPaths.value.filter(lp =>
            lp.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    });

    // Fetch all learning paths on mount
    onMounted(fetchAllLearningPaths);

    // Watch for theme selection changes and filter lerning paths per theme
    watch(selectedThemes, filterLearningPathsByThemes);


</script>

<template>
    <div class="main-container">
        <h1 class="title">{{ t("new-assignment") }}</h1>
        <v-card class="form-card">
            <v-stepper class="stepper-container" alt-labels :items="[t('learning-path'), t('classes'), t('groups')]"
                       v-model="step" show-actions>
                <template v-slot:item.1>
                    <v-card :title="t('choose-lp')" flat>
                        <v-container class="step-container">
                            <v-card-text>
                                <v-select
                                    v-model="selectedThemes"
                                    :items="themeItems.map(theme => ({ title: t(`theme-options.${theme}`), value: theme }))"
                                    variant="solo"
                                    :label="t('filter-themes')"
                                    chips
                                    multiple
                                    deletable-chips
                                    clearable
                                ></v-select>
                            </v-card-text>

                            <v-card-text>
                                <v-combobox
                                    v-model="selectedLearningPath"
                                    :items="searchResults"
                                    :label="t('search-lp')"
                                    variant="solo"
                                    clearable
                                    hide-details
                                    density="compact"
                                    :loading="loading"
                                    append-inner-icon="mdi-magnify"
                                    item-title="title"
                                    item-value="value"
                                    :filter="(item, query: string) => item.title.toLowerCase().includes(query.toLowerCase())"
                                ></v-combobox>
                            </v-card-text>



                        </v-container>
                    </v-card>
                </template>

                <template>
                    <v-card title="Select one or more classes" flat>
                        <v-container class="step-container">
                            <!-- Content for Step Two -->
                        </v-container>
                    </v-card>
                </template>

                <template>
                    <v-card title="Step Three" flat>
                        <v-container class="step-container">
                            <!-- Content for Step Three -->
                        </v-container>
                    </v-card>
                </template>
            </v-stepper>
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
    width: 70%;
    /*padding: 1%;*/
}

.stepper-container {
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
@media (max-width: 650px) {
    .form-card {
        width: 95%;
        padding: 1%;
    }

    .v-stepper-header {
        display: none; /* Hides step numbers on small screens */
    }

    .step-container {
        min-height: 300px; /* Gives enough space */
    }
}
</style>
