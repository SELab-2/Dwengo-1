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
                                :to="`/teacher/${userId}`"
                                append-icon="$vuetify"
                            >
                                teacher
                            </v-btn>
                        </li>
                        <li>
                            <v-btn
                                :to="`/student/${userId}`"
                                append-icon="$vuetify"
                            >
                                student
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

    .container {
        background-color: white;
        width: 350px;
        height: 400px;
    }
</style>
