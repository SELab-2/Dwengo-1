<script setup lang="ts">
    import {useI18n} from "vue-i18n";
    import {ref, shallowRef} from "vue";
    import {THEMESITEMS} from "@/utils/constants.ts";

    const {t} = useI18n();

    const step = ref(1);

    const loading = ref(false)

    function onClick () {
        loading.value = true
    }
    const searchQuery = ref("");



    // Use a list with all themes so learning-paths can be filtered by theme
    const themeItems = ref(Object.keys(THEMESITEMS).slice(1));
    const value = shallowRef([]);
</script>

<template>
    <div class="main-container">
        <h1 class="title">{{ t("new-assignment") }}</h1>
        <v-card class="form-card">
            <v-stepper class="stepper-container" alt-labels :items="[t('learning-path'), t('classes'), t('groups')]"
                       v-model="step" show-actions>
                <template v-slot:item.1>
                    <v-card title="Select a learning path" flat>
                        <v-container class="step-container">
                            <v-card-text>
                                <v-select
                                    v-model="value"
                                    :items="themeItems.map(theme => ({ title: t(`theme-options.${theme}`), value: theme }))"
                                    variant="solo"
                                    label="Filter by themes"
                                    chips
                                    multiple
                                    deletable-chips
                                    clearable
                                ></v-select>
                            </v-card-text>

                            <v-card-text>
                                <v-text-field
                                    :loading="loading"
                                    append-inner-icon="mdi-magnify"
                                    density="compact"
                                    label="Search"
                                    variant="solo"
                                    hide-details
                                    single-line
                                    @click:append-inner="onClick"
                                ></v-text-field>
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
    padding: 1%;
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
