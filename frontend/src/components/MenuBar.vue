<script setup lang="ts">
    import { computed } from "vue";
    import { useRoute } from "vue-router";
    import dwengo_logo from "../../../assets/img/dwengo-groen-zwart.svg";

    const route = useRoute();

    const isTeacher = route.path.includes("teacher");
    const role = isTeacher ? "teacher" : "student";
    const name = "Bob Debouwer"; // TODO: naam opvragen

    const userId = computed(() => route.params.id as string);
</script>

<template>
    <main>
        <nav class="menu">
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
                <li>log out</li>
                <li class="initials">initials</li>
            </ul>
        </nav>
    </main>
</template>

<style scoped>
    .menu {
        background-color: #f6faf2;
    }

    nav ul {
        display: flex;
        list-style-type: none;
        margin: 0;
        padding: 0;
        gap: 10px;
        align-items: center;
    }

    li {
        display: inline;
        float: left;
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
    }

    nav a.router-link-active {
        font-weight: bold;
    }
</style>
