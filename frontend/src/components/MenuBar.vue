<script setup lang="ts">
    import { ref } from "vue";
    import { useI18n } from "vue-i18n";

    import auth from "@/services/auth/auth-service.ts";

    // Import assets
    import dwengoLogo from "../../../assets/img/dwengo-groen-zwart.svg";

    const { t, locale } = useI18n();

    const role = auth.authState.activeRole;

    const name: string = auth.authState.user!.profile.name!;
    const initials: string = name
        .split(" ")
        .map((n) => n[0])
        .join("");

    // Available languages
    const languages = ref([
        { name: "English", code: "en" },
        { name: "Nederlands", code: "nl" },
        { name: "Français", code: "fr" },
        { name: "Deutsch", code: "de" },
    ]);

    // Logic to change the language of the website to the selected language
    const changeLanguage = (langCode: string) => {
        locale.value = langCode;
        localStorage.setItem("user-lang", langCode);
    };

    // contains functionality to let the collapsed menu appear and disappear
    // when the screen size varies
    const drawer = ref(false);

    // when the user wants to logout, a popup is shown to verify this
    // if verified, the user should be logged out
    const performLogout = () => {
        auth.logout();
    };
</script>

<template>
    <main>
        <v-app class="menu_collapsed">
            <v-app-bar
                app
                style="background-color: #f6faf2"
            >
                <template v-slot:prepend>
                    <v-app-bar-nav-icon @click="drawer = !drawer" />
                </template>

                <v-app-bar-title>
                    <router-link
                        to="/user"
                        class="dwengo_home"
                    >
                        <div>
                            <img
                                class="dwengo_logo"
                                :src="dwengoLogo"
                                style="width: 100px"
                            />
                            <p
                                class="caption"
                                style="font-size: smaller"
                            >
                                {{ t(`${role}`) }}
                            </p>
                        </div>
                    </router-link>
                </v-app-bar-title>

                <v-spacer></v-spacer>

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

                <v-btn
                    @click="performLogout"
                    text
                >
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
                            />
                        </template>
                    </v-tooltip>
                </v-btn>
            </v-app-bar>

            <v-navigation-drawer
                v-model="drawer"
                app
            >
                <v-list>
                    <v-list-item
                        to="/user/assignment"
                        link
                    >
                        <v-list-item-content>
                            <v-list-item-title class="menu_item">{{ t("assignments") }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                        to="/user/class"
                        link
                    >
                        <v-list-item-content>
                            <v-list-item-title class="menu_item">{{ t("classes") }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                        to="/user/discussion"
                        link
                    >
                        <v-list-item-content>
                            <v-list-item-title class="menu_item">{{ t("discussions") }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
        </v-app>

        <nav class="menu">
            <div class="left">
                <ul>
                    <li>
                        <router-link
                            to="/user"
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
                            :to="`/user/assignment`"
                            class="menu_item"
                        >
                            {{ t("assignments") }}
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            to="/user/class"
                            class="menu_item"
                            >{{ t("classes") }}</router-link
                        >
                    </li>
                    <li>
                        <router-link
                            to="/user/discussion"
                            class="menu_item"
                            >{{ t("discussions") }}
                        </router-link>
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
                    <!-- <v-btn
                        @click="performLogout"
                        to="/login"
                        style="background-color: transparent; box-shadow: none !important"
                    >
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
                    </v-btn> -->
                    <v-dialog max-width="500">
                        <template v-slot:activator="{ props: activatorProps }">
                            <v-btn
                                v-bind="activatorProps"
                                style="background-color: transparent; box-shadow: none !important"
                            >
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
                                        >
                                        </v-icon>
                                    </template>
                                </v-tooltip>
                            </v-btn>
                        </template>

                        <template v-slot:default="{ isActive }">
                            <v-card :title="t('logoutVerification')">
                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn
                                        :text="t('cancel')"
                                        @click="isActive.value = false"
                                    ></v-btn>
                                    <v-btn
                                        :text="t('logout')"
                                        @click="performLogout"
                                        to="/login"
                                    ></v-btn>
                                </v-card-actions>
                            </v-card>
                        </template>
                    </v-dialog>
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

    @media (max-width: 700px) {
        .menu {
            display: none;
        }
    }

    @media (min-width: 701px) {
        .menu_collapsed {
            display: none;
        }
    }
</style>
