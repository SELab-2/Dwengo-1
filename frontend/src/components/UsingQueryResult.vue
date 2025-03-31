<script setup lang="ts" generic="T">
    import {RemoteResource} from "@/services/api-client/remote-resource.ts";
    import {computed, type MaybeRefOrGetter} from "vue";
    import {useI18n} from "vue-i18n";
    import type {UseQueryReturnType} from "@tanstack/vue-query";

    const props = defineProps<{
        queryResult: UseQueryReturnType<T, Error>
    }>()

    const { t } = useI18n();

    const isLoading = computed(() => props.queryResult.isFetching);
    const data = computed(() => props.queryResult.data);
    const error = computed(() => props.queryResult.error);
    const errorMessage = computed(() => {
        let errorWithMessage = (error.value as {message: string}) || null;
        return errorWithMessage?.message || JSON.stringify(errorWithMessage)
    });
</script>

<template>
    <div class="loading-div" v-if="isLoading">
        <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-if="error">
        <v-empty-state
            icon="mdi-alert-circle-outline"
            :text="errorMessage"
            :title="t('error_title')"
        ></v-empty-state>
    </div>
    <slot v-if="data" :data="data!"></slot>
</template>

<style scoped>
  .loading-div {
      padding: 20px;
      text-align: center;
  }
</style>
