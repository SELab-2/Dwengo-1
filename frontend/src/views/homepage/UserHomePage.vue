<script setup lang="ts">
    import {ref, watch} from "vue";
    import { useI18n } from "vue-i18n";
    import {AGEITEMS, THEMESITEMS} from "@/utils/constants.ts";
    import BrowseThemes from "@/components/BrowseThemes.vue";

    const { t, locale } = useI18n();


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
        <h1 class="title">{{ t("themes") }}</h1>
        <v-container class="dropdowns">
            <v-select class="v-select"
                :label="t('choose-theme')"
                      :items="THEMESITEMS.map(theme => t(`theme-options.${theme}`))"
                      v-model="selectedTheme"
                      variant="outlined"
            ></v-select>
            <v-select class="v-select"
                :label="t('choose-age')"
                      :items="AGEITEMS.map(age => t(`age-options.${age}`))"
                      v-model="selectedAge"
                    variant="outlined"
            ></v-select>
        </v-container>
        <BrowseThemes/>
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
    }

    .title {
        max-width: 50rem;
        margin-left: 1rem;
        margin-top: 1rem;
        text-align: center;
        display: flex;
        justify-content: center;
    }


    .dropdowns {
        display: flex;
        justify-content: space-between;
        gap: 5rem;
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

    @media (max-width: 700px) {
        .dropdowns {
            flex-direction: column;
            gap: 1rem;
            width: 80%;
        }
    }

</style>
