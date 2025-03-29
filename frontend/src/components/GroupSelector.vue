<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    students: Array, // All students
    availableClass: Object, // Selected class
    groups: Array, // All groups
});
const emit = defineEmits(['groupCreated']);
const { t } = useI18n();

const selectedStudents = ref([]);

// Filter students based on the selected class and exclude students already in a group
const filteredStudents = computed(() => {
    if (props.availableClass) {
        const studentsInClass = props.availableClass.students.map(st => ({
            title: `${st.firstName} ${st.lastName}`,
            value: st.username,
        }));

        const studentsInGroups = props.groups.flat();

        return studentsInClass.filter(student => !studentsInGroups.includes(student.value));
    }
    return [];
});


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
    <v-card-text>
        <v-combobox
            v-model="selectedStudents"
            :items="filteredStudents"
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

        <v-btn @click="createGroup" color="primary" class="mt-2" size="small">{{ t('create-group') }}</v-btn>
    </v-card-text>
</template>

<style scoped>

</style>
