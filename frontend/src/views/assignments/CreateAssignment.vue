<script setup lang="ts">
    import {useRoute} from "vue-router";

    const route = useRoute();
</script>

<template>
    <main>
        Hier zou de pagina staan om een assignment aan te maken voor de leerpad met hruid {{ route.query.hruid }} en
        language {{ route.query.language }}. (Overschrijf dit)
    </main>
</template>

<style scoped></style>
