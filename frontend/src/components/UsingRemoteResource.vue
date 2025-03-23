<script setup lang="ts" generic="T">
import {type ErrorState, RemoteResource, type RemoteResourceState} from "@/services/api-client/remote-resource.ts";
import {computed, onMounted, reactive, ref, type UnwrapNestedRefs, watch} from "vue";
    import {useI18n} from "vue-i18n";

    const props = defineProps<{
        resource: RemoteResource<T> | (UnwrapNestedRefs<RemoteResource<T>> & {})
    }>()

    const resource = reactive(props.resource as RemoteResource<T>);

    const { t } = useI18n();

    const isLoading = computed(() => resource.state.type === 'loading');
    const isError = computed(() => resource.state.type === 'error');

    // `data` will be correctly inferred as `T`
    const data = computed(() => resource.data);

    const error = computed(() => resource.state.type === "error" ? resource.state as ErrorState : null);
    const errorMessage = computed(() =>
        error.value?.message ? error.value.message : JSON.stringify(error.value?.error)
    );

    watch(data, (newValue, _) => {
        if (!newValue && resource.state.type !== "loading") {
            (resource as RemoteResource<T>).startRequestInBackground();
        }
    }, {immediate: true});
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
      margin: 10px;
  }
</style>
