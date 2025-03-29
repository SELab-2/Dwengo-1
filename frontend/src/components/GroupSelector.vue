<script setup lang="ts">
    import { ref, defineProps, defineEmits } from 'vue';
    import { useI18n } from 'vue-i18n';

    const props = defineProps({
        students: Array,
    });
    const emit = defineEmits(['groupCreated']);
    const { t } = useI18n();
    const selectedStudents = ref([]);

    const createGroup = () => {
        if (selectedStudents.value.length) {
            emit('groupCreated', selectedStudents.value);
            selectedStudents.value = []; // Reset selection after creating group
        }
    };
</script>

<template>
    <v-card-text>
        <v-combobox
            v-model="selectedStudents"
            :items="props.students"
            :label="t('choose-groups')"
            variant="solo"
            clearable
            multiple
            hide-details
            chips
            append-inner-icon="mdi-magnify"
            item-title="title"
            item-value="value"
        ></v-combobox>
        <v-btn @click="createGroup" color="primary" class="mt-2" size="small">{{ t('create-group') }}</v-btn>
    </v-card-text>
</template>

<style scoped>

</style>
