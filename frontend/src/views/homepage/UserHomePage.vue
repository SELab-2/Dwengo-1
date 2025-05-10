<script setup lang="ts">
    import { ref, watch } from "vue";
    import { useI18n } from "vue-i18n";
    import { THEMESITEMS, AGE_TO_THEMES } from "@/utils/constants.ts";
    import BrowseThemes from "@/components/BrowseThemes.vue";

    const { t, locale } = useI18n();

    const selectedThemeKey = ref<string>("all");
    const selectedAgeKey = ref<string>("all");

    const allThemes = ref(Object.keys(THEMESITEMS));
    const availableThemes = ref([...allThemes.value]);

    const allAges = ref(Object.keys(AGE_TO_THEMES));
    const availableAges = ref([...allAges.value]);

    // Reset selection when language changes
    watch(locale, () => {
        selectedThemeKey.value = "all";
        selectedAgeKey.value = "all";
    });

    watch(selectedThemeKey, () => {
        if (selectedThemeKey.value === "all") {
            availableAges.value = [...allAges.value]; // Reset to all ages
        } else {
            const themes = THEMESITEMS[selectedThemeKey.value];
            availableAges.value = allAges.value.filter((age) =>
                AGE_TO_THEMES[age]?.some((theme) => themes.includes(theme)),
            );
        }
    });

    watch(selectedAgeKey, () => {
        if (selectedAgeKey.value === "all") {
            availableThemes.value = [...allThemes.value]; // Reset to all themes
        } else {
            const themes = AGE_TO_THEMES[selectedAgeKey.value];
            availableThemes.value = allThemes.value.filter((theme) =>
                THEMESITEMS[theme]?.some((theme) => themes.includes(theme)),
            );
        }
    });
</script>

<template>
    <div class="main-container">
        <h1 class="title">{{ t("themes") }}</h1>
        <v-container class="dropdowns">
            <v-select
                class="v-select"
                :label="t('choose-theme')"
                :items="availableThemes.map((theme) => ({ title: t(`theme-options.${theme}`), value: theme }))"
                v-model="selectedThemeKey"
                item-title="title"
                item-value="value"
                variant="outlined"
            />

            <v-select
                class="v-select"
                :label="t('choose-age')"
                :items="availableAges.map((age) => ({ key: age, label: t(`age-options.${age}`), value: age }))"
                v-model="selectedAgeKey"
                item-title="label"
                item-value="key"
                variant="outlined"
            ></v-select>
        </v-container>

        <BrowseThemes
            :selectedTheme="selectedThemeKey ?? ''"
            :selectedAge="selectedAgeKey ?? ''"
        />
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

    h1 {
        color: #0e6942;
        text-transform: uppercase;
        font-weight: bolder;
        font-size: 50px;
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
