<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import authState from "@/services/auth/auth-service.ts";
    const { t, locale } = useI18n();

    const role: String = authState.authState.activeRole!;

    const classIds = ["class01", "class02", "class03"];
    const classmembers = [22, 11, 9];
    const zipped = classIds.map((item, index) => [item, classmembers[index]]);
</script>
<template>
    <main>
        <h class="title">{{ t("classes") }}</h>
        <div v-if="role === 'student'">
            <v-table class="table">
                <thead>
                    <tr>
                        <th class="header">{{ t("classes") }}</th>
                        <th class="header">{{ t("members") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="[id, members] in zipped"
                        :key="id"
                    >
                        <td>{{ id }}</td>
                        <td>{{ members }}</td>
                    </tr>
                </tbody>
            </v-table>
        </div>
        <div v-else>
            <v-table class="table">
                <thead>
                    <tr>
                        <th class="header">{{ t("classes") }}</th>
                        <th class="header">{{ t("members") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="[id, members] in zipped"
                        :key="id"
                    >
                        <td>{{ id }}</td>
                        <td>{{ members }}</td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </main>
</template>

<style scoped>
    .header {
        font-weight: bold !important;
        background-color: #0e6942;
        color: white;
        padding: 10px;
    }

    table thead th:first-child {
        border-top-left-radius: 10px; /* Top-left rounded corner */
    }

    .table thead th:last-child {
        border-top-right-radius: 10px; /* Top-right rounded corner */
    }

    .table tbody tr:nth-child(odd) {
        background-color: white;
    }

    .table tbody tr:nth-child(even) {
        background-color: #f6faf2;
    }

    td,
    th {
        border-bottom: 1px solid #0e6942;
        border-top: 1px solid #0e6942;
    }

    .table {
        width: 60%;
        margin: 0 auto;
        padding-top: 3%;
        border-collapse: collapse;
    }

    .title {
        color: #0e6942;
        text-transform: uppercase;
        font-weight: bolder;
        padding-left: 30px;
        padding-top: 2%;
        font-size: 50px;
    }
</style>
