<script setup lang="ts">
    import { ref } from "vue";
    import { useI18n } from "vue-i18n";
    import { useRouter } from "vue-router";

    import auth from "@/services/auth/auth-service.ts";

    // Import assets
    import dwengoLogo from "../../../assets/img/dwengo-groen-zwart.svg";

    const { t, locale } = useI18n();

    const role = auth.authState.activeRole;
    const _router = useRouter(); // Zonder '_' gaf dit een linter error voor unused variable

    const name: string = auth.authState.user!.profile.name!;
    const username = auth.authState.user!.profile.preferred_username!;
    const email = auth.authState.user!.profile.email;
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
    function changeLanguage(langCode: string): void {
        locale.value = langCode;
        localStorage.setItem("user-lang", langCode);
    }

    // Contains functionality to let the collapsed menu appear and disappear when the screen size varies
    const drawer = ref(false);

    // When the user wants to logout, a popup is shown to verify this
    // If verified, the user should be logged out
    async function performLogout(): Promise<void> {
        await auth.logout();
    }
</script>

<template>
    <v-app-bar
        class="app-bar"
        app
    >
        <v-app-bar-nav-icon
            class="menu_collapsed"
            @click="drawer = !drawer"
        />
        <router-link
            to="/user"
            class="dwengo_home"
        >
            <div>
                <img
                    class="dwengo_logo"
                    alt="Dwengo logo"
                    :src="dwengoLogo"
                />
                <p class="caption">
                    {{ t(`${role}`) }}
                </p>
            </div>
        </router-link>
        <v-toolbar-items class="menu">
            <v-btn
                class="menu_item"
                variant="text"
                to="/user/assignment"
            >
                {{ t("assignments") }}
            </v-btn>
            <v-btn
                class="menu_item"
                variant="text"
                to="/user/class"
            >
                {{ t("classes") }}
            </v-btn>
            <!-- TODO Re-enable this button when the discussion page is ready -->
            <!--            <v-btn-->
            <!--                class="menu_item"-->
            <!--                variant="text"-->
            <!--                to="/user/discussion"-->
            <!--            >-->
            <!--                {{ t("discussions") }}-->
            <!--            </v-btn>-->
        </v-toolbar-items>
        <v-menu
            open-on-hover
            open-on-click
        >
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
        <v-spacer></v-spacer>
        <v-dialog max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                    v-bind="activatorProps"
                    :rounded="true"
                    variant="text"
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
        <v-menu min-width="200px">
            <template v-slot:activator="{ props }">
                <v-btn
                    icon
                    v-bind="props"
                >
                    <v-avatar
                        color="#0e6942"
                        size="large"
                        class="user-button"
                    >
                        <span>{{ initials }}</span>
                    </v-avatar>
                </v-btn>
            </template>
            <v-card>
                <v-card-text>
                    <div class="mx-auto text-center">
                        <v-avatar
                            color="#0e6942"
                            size="large"
                            class="user-button mb-3"
                        >
                            <span>{{ initials }}</span>
                        </v-avatar>
                        <h3>{{ name }}</h3>
                        <p class="text-caption mt-1">{{ username }}</p>
                        <p class="text-caption mt-1">{{ email }}</p>
                        <v-divider class="my-3"></v-divider>
                        <v-btn
                            variant="text"
                            rounded
                            append-icon="mdi-logout"
                            @click="performLogout"
                            to="/login"
                            >{{ t("logout") }}</v-btn
                        >
                        <v-divider class="my-3"></v-divider>
                    </div>
                </v-card-text>
            </v-card>
        </v-menu>
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        temporary
        app
    >
        <v-list>
            <v-list-item
                to="/user/assignment"
                link
            >
                <v-list-item-title class="menu_item">{{ t("assignments") }}</v-list-item-title>
            </v-list-item>

            <v-list-item
                to="/user/class"
                link
            >
                <v-list-item-title class="menu_item">{{ t("classes") }}</v-list-item-title>
            </v-list-item>

            <v-list-item
                to="/user/discussion"
                link
            >
                <v-list-item-title class="menu_item">{{ t("discussions") }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<style scoped>
    .app-bar {
        background-color: #f6faf2;
    }
    .menu {
        background-color: #f6faf2;
        display: flex;
        justify-content: space-between;
    }
    .user-button {
        margin-right: 10px;
        font-size: large;
        font-weight: bold;
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
        text-transform: none;
    }

    .translate-button {
        z-index: 1;
        position: relative;
        margin-left: 10px;
    }

    @media (max-width: 700px) {
        .menu {
            display: none;
        }
        .caption {
            font-size: smaller;
        }
        .dwengo_logo {
            width: 100px;
        }
    }

    @media (min-width: 701px) {
        .menu_collapsed {
            display: none;
        }
    }
</style>
