<script setup lang="ts">
import {ref, defineProps, defineEmits} from 'vue';
import {useI18n} from 'vue-i18n';
import {useClassStudentsQuery} from "@/queries/classes-temp.ts";
import UsingQueryResult from "@/components/UsingQueryResult.vue";
import type {StudentsResponse} from "@/controllers/students.ts";

const props = defineProps<{
    classId: string | undefined
    groups: string[][], // All groups
}>();
const emit = defineEmits(['groupCreated']);
const {t} = useI18n();

const selectedStudents = ref([]);

const studentQueryResult = useClassStudentsQuery(() => props.classId, true);


function filterStudents(data: StudentsResponse): { title: string, value: string }[] {
    const students = data.students;
    const studentsInGroups = props.groups.flat();

    return students
        ?.map(st => ({
            title: `${st.firstName} ${st.lastName}`,
            value: st.username,
        }))
        .filter(student => !studentsInGroups.includes(student.value));
}


const createGroup = () => {
    if (selectedStudents.value.length) {
        // Extract only usernames (student.value)
        const usernames = selectedStudents.value.map(student => student.value);
        emit('groupCreated', usernames);
        selectedStudents.value = []; // Reset selection after creating group
    }
};
</script>


<template>
    <using-query-result
        :query-result="studentQueryResult"
        v-slot="{ data }: { data: StudentsResponse }"
    >
        <h3>{{ t('create-groups') }}</h3>
        <v-card-text>
            <v-combobox
                v-model="selectedStudents"
                :items="filterStudents(data)"
                item-title="title"
                item-value="value"
                :label="t('choose-students')"
                variant="outlined"
                clearable
                multiple
                hide-details
                density="compact"
                chips
                append-inner-icon="mdi-magnify"
            ></v-combobox>

            <v-btn @click="createGroup" color="primary" class="mt-2" size="small">
                {{ t('create-group') }}
            </v-btn>
        </v-card-text>
    </using-query-result>

</template>

<style scoped>

</style>
