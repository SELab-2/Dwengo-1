<script setup lang="ts">
    import { useClassQuery } from "@/queries/classes";
    import { defineProps } from "vue";
    import UsingQueryResult from "@/components/UsingQueryResult.vue";

    const props = defineProps({
        classId: String,
    });

    const classQuery = useClassQuery(props.classId);
</script>

<template>
    <using-query-result
        :query-result="classQuery"
        v-slot="{ data: classResponse }"
    >
        <span>{{ classResponse?.class.displayName }}</span>
    </using-query-result>
</template>
