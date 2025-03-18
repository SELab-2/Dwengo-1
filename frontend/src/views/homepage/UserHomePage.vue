<script setup lang="ts">
import {ref, watch} from "vue";
    import { useI18n } from "vue-i18n";

    const { t, locale } = useI18n();

    const themesItems = ref(["all-themes", "culture", "electricity-and-mechanics", "nature-and-climate", "agriculture", "society", "math", "technology", "algorithms"]);

    const ageItems = ref(["all-ages",  "primary-school", "lower-secondary", "upper-secondary", "high-school", "older"]);

    const selectedTheme = ref(t('choose-theme'));
    const selectedAge = ref(t('choose-age'));

    // Watch for language change and update the labels accordingly
    watch(locale, () => {
        // Make sure that when the language is changed the
        selectedTheme.value = t('choose-theme');
        selectedAge.value = t('choose-age');
    });

</script>

<template>
    <div class="main-container">
        <div class="header">
            <h1>{{ t("themes") }}</h1>
        </div>
        <div class="dropdowns">
            <v-select class="v-select"
                :label="t('choose-theme')"
                      :items="themesItems.map(theme => t(`theme-options.${theme}`))"
                      v-model="selectedTheme"
                      variant="outlined"
            ></v-select>
            <v-select class="v-select"
                :label="t('choose-age')"
                      :items="ageItems.map(age => t(`age-options.${age}`))"
                      v-model="selectedAge"
                    variant="outlined"
            ></v-select>
        </div>
        <div class="content"></div>
    </div>
</template>

<style scoped>
    .main-container {
        min-height: 100vh;
        min-width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 2rem;
    }

    .header {
        width: 60%;
        max-width: 50rem;
        margin-bottom: 1rem;
    }

    .dropdowns {
        display: flex;
        justify-content: space-between;
        gap: 3rem;
        width: 80%;
    }

    .v-select {
        flex: 1;
        min-width: 100px;
    }


    @media (max-width: 768px) {
        .main-container {
            padding: 1rem;
        }
    }


</style>
