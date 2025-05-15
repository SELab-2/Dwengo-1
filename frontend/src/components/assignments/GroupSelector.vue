<script setup lang="ts">
import { ref, } from "vue";
import draggable from "vuedraggable";
import { useI18n } from "vue-i18n";

const props = defineProps<{
    classId: string | undefined;
    groups: string[][];
}>();
const emit = defineEmits(["done", "groupsUpdated"]);
const { t } = useI18n();

const groupList = ref(props.groups.map(g => [...g])); // deep copy
const unassigned = ref<string[]>([]); // voor vrije studenten

function addNewGroup() {
    groupList.value.push([]);
}

function removeGroup(index: number) {
    unassigned.value.push(...groupList.value[index]);
    groupList.value.splice(index, 1);
}

function saveChanges() {
    emit("groupsUpdated", groupList.value);
    emit("done");
}
</script>

<template>
    <v-card>
        <v-card-title>{{ t("edit-groups") }}</v-card-title>
        <v-card-text>
            <v-row>
                <!-- Ongegroepeerde studenten -->
                <v-col cols="12" sm="4">
                    <h4>{{ t("unassigned") }}</h4>
                    <draggable
                        v-model="unassigned"
                        group="students"
                        item-key="username"
                        class="group-box"
                    >
                        <template #item="{ element }">
                            <v-chip>{{ element }}</v-chip>
                        </template>
                    </draggable>
                </v-col>

                <!-- Bestaande groepen -->
                <v-col
                    v-for="(group, i) in groupList"
                    :key="i"
                    cols="12"
                    sm="4"
                >
                    <h4>{{ t("group") }} {{ i + 1 }}</h4>
                    <draggable
                        v-model="groupList[i]"
                        group="students"
                        item-key="username"
                        class="group-box"
                    >
                        <template #item="{ element }">
                            <v-chip>{{ element }}</v-chip>
                        </template>
                    </draggable>

                    <v-btn
                        color="error"
                        size="x-small"
                        @click="removeGroup(i)"
                        class="mt-2"
                    >
                        {{ t("remove-group") }}
                    </v-btn>
                </v-col>
            </v-row>

            <v-btn
                color="primary"
                class="mt-4"
                @click="addNewGroup"
            >
                {{ t("add-group") }}
            </v-btn>
        </v-card-text>
        <v-card-actions>
            <v-btn
                color="success"
                @click="saveChanges"
            >
                {{ t("save") }}
            </v-btn>
            <v-btn
                @click="$emit('done')"
                variant="text"
            >
                {{ t("cancel") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.group-box {
    min-height: 100px;
    border: 1px dashed #ccc;
    padding: 8px;
    margin-bottom: 16px;
    background-color: #fafafa;
}
</style>
