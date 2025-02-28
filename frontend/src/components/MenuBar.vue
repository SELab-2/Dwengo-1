<script setup lang="ts">
    import { computed } from "vue";
    import { useRoute } from "vue-router";
    import dwengo_logo from "../../../assets/img/dwengo-groen-zwart.svg";

    const route = useRoute();

    const isTeacher = route.path.includes("teacher");
    const role = isTeacher ? "teacher" : "student";
    const name = "Kurt Cobain"; //TODO: naam opvragen
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("");

    const userId = computed(() => route.params.id as string);
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
                                :src="dwengo_logo"
                            />
                            <p class="caption">
                                {{ role }}
                            </p>
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            :to="`/${role}/${userId}/assignment`"
                            class="menu_item"
                        >
                            assignments
                        </router-link>
                    </li>
                    <li>
                        <router-link
                            :to="`/${role}/${userId}/class`"
                            class="menu_item"
                            >classes</router-link
                        >
                    </li>
                    <li>
                        <router-link
                            :to="`/${role}/${userId}/discussion`"
                            class="menu_item"
                            >discussions</router-link
                        >
                    </li>
                </ul>
            </div>
            <div class="right">
                <li>
                    <!-- TODO: log out when clicked -->
                    <router-link :to="`/login`">
                        <v-icon
                            icon="mdi-logout"
                            size="x-large"
                            color="#0e6942"
                        ></v-icon>
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
