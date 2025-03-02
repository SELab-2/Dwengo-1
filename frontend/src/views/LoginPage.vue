<script setup lang="ts">
    import dwengoLogo from "../../../assets/img/dwengo-groen-zwart.svg";

    const userId = 1;
</script>

<template>
    <main>
        <div class="login_background">
            <ul>
                <img
                    class="dwengo_logo"
                    :src="dwengoLogo"
                />
                <div class="container">
                    <ul>
                        <li>login</li>
                        <li>
                            <v-btn
                                class="button"
                                :to="`/teacher/${userId}`"
                            >
                                teacher
                                <v-icon
                                    end
                                    size="x-large"
                                    >mdi-menu-right</v-icon
                                >
                            </v-btn>
                        </li>
                        <li>
                            <v-btn
                                class="button"
                                :to="`/student/${userId}`"
                            >
                                student
                                <v-icon
                                    end
                                    size="x-large"
                                    >mdi-menu-right</v-icon
                                >
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
        align-items: center;
    }

    li {
        padding: 20px;
        align-items: center;
    }

    .button {
        background-color: #f6faf2;
    }

    .container {
        background-color: white;
        width: 350px;
        height: 400px;
    }
</style>
