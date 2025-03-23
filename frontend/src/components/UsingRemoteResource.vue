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

    // `data` will be correctly inferred as `T`
    const data = computed(() => props.resource.data);

    const error = computed(() => props.resource.state.type === "error" ? props.resource.state : null);
    const errorMessage = computed(() =>
        error.value?.message ? error.value.message : JSON.stringify(error.value?.error)
    );
</script>

<template>
    <div v-if="isLoading">
        <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-if="isError">
        <v-empty-state
            icon="mdi-alert-circle-outline"
            text="errorMessage"
            :title=t("error_title")
        ></v-empty-state>
    </div>
</template>

<style scoped>

</style>
