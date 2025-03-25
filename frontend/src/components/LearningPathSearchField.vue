<script setup lang="ts">
    import {useI18n} from "vue-i18n";
    import {useRoute, useRouter} from "vue-router";
    import {computed, ref} from "vue";
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();

    const SEARCH_PATH = "/learningPath/search";

    const query = computed({
        get: () => route.query.query as string | null,
        set: (newValue) => router.push({path: SEARCH_PATH, query: {query: newValue}})
    });

    const queryInput = ref(query.value);

    function search() {
        query.value = queryInput.value;
    }
</script>

<template>
    <v-text-field
        class="search-field"
        :label="t('search')"
        append-inner-icon="mdi-magnify"
        v-model="queryInput"
        @keyup.enter="search()"
        @click:append-inner="search()"
    ></v-text-field>
</template>

<style scoped>

</style>
