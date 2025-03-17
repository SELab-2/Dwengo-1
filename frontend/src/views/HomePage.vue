<script setup lang="ts">
    import { ref } from "vue";
    import dwengoLogo from "../../../assets/img/dwengo-groen-zwart.svg";
    import { useI18n } from "vue-i18n";

    const { t, locale } = useI18n();

    const languages = ref([
        { name: "English", code: "en" },
        { name: "Nederlands", code: "nl" },
        { name: "Deutsch", code: "de" },
        { name: "français", code: "fr" },
    ]);

    // Logic to change the language of the website to the selected language
    const changeLanguage = (langCode: string) => {
        locale.value = langCode;
        localStorage.setItem("user-lang", langCode);
    };
</script>

<template>
    <main>
        <div class="layout">
            <div class="container_left">
                <img :src="dwengoLogo" />
                <h> {{ t("homeTitle") }}</h>
                <p class="info">
                    {{ t("homeIntroduction") }}
                </p>
                <v-btn
                    size="large"
                    density="comfortable"
                    style="font-weight: bolder; color: white"
                    color="#88BD28"
                    to="/login"
                >
                    {{ t("login") }}
                    <v-icon
                        end
                        size="x-large"
                    >
                        mdi-menu-right
                    </v-icon>
                </v-btn>
            </div>
            <div class="container_middle">
                <div class="img_small">
                    <v-img
                        height="125"
                        width="125"
                        src="/assets/home/innovative.png"
                    ></v-img>
                    <h class="big">{{ t("innovative") }}</h>
                </div>
                <div class="img_small">
                    <v-img
                        height="125"
                        width="125"
                        src="/assets/home/research_based.png"
                    ></v-img>
                    <h class="big">{{ t("researchBased") }}</h>
                </div>
                <div class="img_small">
                    <v-img
                        height="125"
                        width="125"
                        src="/assets/home/inclusive.png"
                    ></v-img>
                    <h class="big">{{ t("sociallyRelevant") }}</h>
                </div>
                <div class="img_small">
                    <v-img
                        height="125"
                        width="125"
                        src="/assets/home/socially_relevant.png"
                    ></v-img>
                    <h class="big">{{ t("inclusive") }}</h>
                </div>
            </div>
            <div class="container_right">
                <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            icon
                            variant="text"
                        >
                            {{ t("translate") }}
                            <v-icon
                                end
                                icon="mdi-translate"
                                size="small"
                                color="#0e6942"
                            ></v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item
                            v-for="(language, index) in languages"
                            :key="index"
                            @click="changeLanguage(language.code)"
                        >
                            <v-list-item-title>{{ language.name }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>
    </main>
</template>
<style scoped>
    .layout {
        display: flex;
        width: 100vw;
        height: 100vh;
        position: relative;
        flex-wrap: wrap;
    }

    .container_left {
        width: 600px;
        background-color: #f6faf2;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .container_middle {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding: 20px;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .container_right {
        position: absolute;
        top: 2%;
        right: 100px;
    }

    .img_small {
        display: flex;
        align-items: center;
        margin: 20px;
    }

    img {
        width: 300px;
        margin-bottom: 10px;
    }

    h {
        font-size: large;
        font-weight: bold;
        padding: 10px;
    }

    .big {
        font-size: x-large;
    }

    .info {
        text-align: center;
        padding-bottom: 30px;
    }
</style>
