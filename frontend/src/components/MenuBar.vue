<script setup lang="ts">
    import { ref } from "vue";
    import { useRoute } from "vue-router";
    import dwengoLogo from "../../../assets/img/dwengo-groen-zwart.svg";
    import {useI18n} from "vue-i18n";

    const route = useRoute();
    const { t, locale } = useI18n()

    // Instantiate variables to use in html to render right
    // Links and content dependent on the role (student or teacher)
    const isTeacher = route.path.includes("teacher");

    const userId = route.params.id as string;

    const role = isTeacher ? "teacher" : "student";
    const name = "Kurt Cobain";
    const initials = name
        .split(" ")
        .map((n) => {
            return n[0];
        })
        .join("");

    const languages = ref([
        { name: "English", code: "en" },
        { name: "Nederlands", code: "nl" },
    ]);

    // Logic to change the language of the website to the selected language
    const changeLanguage = (langCode: string) => {
        locale.value = langCode;
        localStorage.setItem('user-lang', langCode);
        console.log(langCode);
    };
</script>

<template>
    <main>
        <nav class="menu">
            <div class="left">
                <ul>
                    <li>
                        <router-link
                            :to="`/${role}/${userId}`"
                            class="dwengo_home"
                        >
                            <img
                                class="dwengo_logo"
                                :src="dwengoLogo"
                            />
                            <p class="caption">
                                {{ t(`${role}`) }}
                            </p>
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            :to="`/${role}/${userId}/assignment`"
                            class="menu_item"
                        >
                            {{ t('assignments') }}
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            :to="`/${role}/${userId}/class`"
                            class="menu_item"
                            >{{ t('classes') }}</router-link
                        >
                    </li>
                    <li>
                        <router-link
                            :to="`/${role}/${userId}/discussion`"
                            class="menu_item"
                            >{{ t('discussions') }} </router-link
                        >
                    </li>
                    <li>
                        <v-menu open-on-hover>
                            <template v-slot:activator="{ props }">
                                <v-btn
                                    v-bind="props"
                                    icon
                                    variant="text"
                                >
                                    <v-icon
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
                    </li>
                </ul>
            </div>
            <div class="right">
                <li>
                    <router-link :to="`/login`">
                        <v-tooltip
                            :text="t('logout')"
                            location="bottom"
                        >
                            <template v-slot:activator="{ props }">
                                <v-icon
                                    v-bind="props"
                                    icon="mdi-logout"
                                    size="x-large"
                                    color="#0e6942"
                                ></v-icon>
                            </template>
                        </v-tooltip>
                    </router-link>
                </li>
                <li>
                    <v-avatar
                        size="large"
                        color="#0e6942"
                        style="font-size: large; font-weight: bold"
                        >{{ initials }}</v-avatar
                    >
                </li>
            </div>
        </nav>
    </main>
</template>

<style scoped>
    .menu {
        background-color: #f6faf2;
        display: flex;
        justify-content: space-between;
    }

    .right {
        align-items: center;
        padding: 10px;
    }

    .right li {
        margin-left: 15px;
    }

    nav ul {
        display: flex;
        list-style-type: none;
        margin: 0;
        padding: 0;
        gap: 15px;
        align-items: center;
    }

    li {
        display: inline;
    }

    .dwengo_home {
        text-align: center;
        text-decoration: none;
    }

    .dwengo_logo {
        width: 150px;
    }

    .caption {
        color: black;
        margin-top: -25px;
    }

    .menu_item {
        color: #0e6942;
        text-decoration: none;
        font-size: large;
    }

    nav a.router-link-active {
        font-weight: bold;
    }
</style>
