<script setup lang="ts">
    import { useRouter } from "vue-router";
    import dwengoLogo from "../../../assets/img/dwengo-groen-zwart.svg";
    import auth from "@/services/auth/auth-service.ts";
    import { watch } from "vue";

    const router = useRouter();

    watch(
        () => auth.isLoggedIn.value,
        async (newVal) => {
            if (newVal) {
                await router.push("/user");
            }
        },
        { immediate: true },
    );

    async function loginAsStudent(): Promise<void> {
        await auth.loginAs("student");
    }

    async function loginAsTeacher(): Promise<void> {
        await auth.loginAs("teacher");
    }
</script>

<template>
    <main>
        <div
            class="login_background"
            v-if="!auth.isLoggedIn.value"
        >
            <ul>
                <img
                    class="dwengo_logo"
                    :src="dwengoLogo"
                />
                <div class="container">
                    <ul>
                        <li class="title">login</li>
                        <li>
                            <v-btn
                                density="comfortable"
                                size="large"
                                class="button"
                                @click="loginAsTeacher"
                            >
                                teacher
                                <v-icon
                                    end
                                    size="x-large"
                                >
                                    mdi-menu-right
                                </v-icon>
                            </v-btn>
                        </li>
                        <li>
                            <v-btn
                                density="comfortable"
                                size="large"
                                class="button"
                                @click="loginAsStudent"
                            >
                                student
                                <v-icon
                                    end
                                    size="x-large"
                                >
                                    mdi-menu-right
                                </v-icon>
                            </v-btn>
                        </li>
                    </ul>
                </div>
            </ul>
        </div>
    </main>
</template>

<style scoped>
    .login_background {
        background-color: #f6faf2;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    img {
        width: 200px;
    }

    ul {
        list-style: none;
        text-align: center;
    }

    li {
        padding: 10px;
    }

    .button {
        background-color: #f6faf2;
    }

    .container {
        background-color: white;
        width: 300px;
        height: 400px;
    }

    .title {
        font-weight: bold;
        font-size: xx-large;
        text-transform: uppercase;
    }
</style>
