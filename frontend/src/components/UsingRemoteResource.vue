<script setup lang="ts" generic="T">
    import {RemoteResource} from "@/services/api-client/remote-resource.ts";
    import {computed} from "vue";
    import {useI18n} from "vue-i18n";

    const props = defineProps<{
        resource: RemoteResource<T>
    }>()

    const { t } = useI18n();

    const isLoading = computed(() => props.resource.state.type === 'loading');
    const isError = computed(() => props.resource.state.type === 'error');
    const data = computed(() => props.resource.state.type === 'success' ? props.resource.state.data : null);

    const error = computed(() => props.resource.state.type === "error" ? props.resource.state : null);
    const errorMessage = computed(() =>
        error.value?.error.message ? error.value.error.message : JSON.stringify(error.value?.error)
    );
</script>

<template>
    <div class="loading-div" v-if="isLoading">
        <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-if="isError">
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
      text-align: center;
  }
</style>
