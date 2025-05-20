<script setup lang="ts">
    import UsingQueryResult from "@/components/UsingQueryResult.vue";
    import { useGroupsQuery } from "@/queries/groups.ts";
    import type { GroupsResponse } from "@/controllers/groups.ts";
    import { useI18n } from "vue-i18n";
    import type { GroupDTO } from "@dwengo-1/common/interfaces/group";

    const { t } = useI18n();

    const props = defineProps<{
        classId: string;
        assignmentNumber: number;
    }>();

    const model = defineModel<number | undefined>({ default: undefined });

    const groupsQuery = useGroupsQuery(props.classId, props.assignmentNumber, true);

    function sortedGroups(groups: GroupDTO[]): GroupDTO[] {
        return [...groups].sort((a, b) => a.groupNumber - b.groupNumber)
    }
    function groupOptions(groups: GroupDTO[]): number[] {
        return sortedGroups(groups).map((group) => group.groupNumber);
    }
    function labelForGroup(groups: GroupDTO[], groupId: number): string {
        return `${sortedGroups(groups).findIndex(group => group.groupNumber === groupId) + 1}`;
    }
</script>

<template>
    <using-query-result
        :query-result="groupsQuery"
        v-slot="{ data }: { data: GroupsResponse }"
    >
        <v-select
            :label="t('viewAsGroup')"
            :items="groupOptions(data.groups)"
            v-model="model"
            :item-title="item => labelForGroup(data.groups, parseInt(`${item}`))"
            :item-value="item => item"
            class="group-selector-cb"
            variant="outlined"
            clearable
        ></v-select>
    </using-query-result>
</template>

<style scoped>
    .group-selector-cb {
        margin-top: 10px;
    }
</style>
