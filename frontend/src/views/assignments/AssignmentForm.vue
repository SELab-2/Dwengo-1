<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {computed, onMounted, ref, watch, defineProps, defineEmits} from "vue";
import GroupSelector from "@/components/GroupSelector.vue";
import DeadlineSelector from "@/components/DeadlineSelector.vue";
import {
    assignmentTitleRules,
    classesRules,
    descriptionRules,
    learningPathRules
} from "@/utils/assignmentForm.ts";

const {t, locale} = useI18n();
const emit = defineEmits(["submit"]);

const props = defineProps({
    sort: {type: String},
    initialTitle: {type: String, default: ""},
    initialDeadline: {type: Date, default: null},
    initialDescription: {type: String, default: ""},
    initialLearningPath: {type: Object, default: null},
    initialClass: {type: Object, default: null},
    initialGroups: {type: Array, default: () => []}
});

const form = ref();
const language = ref(locale.value);
const searchQuery = ref("");
const assignmentTitle = ref(props.initialTitle);
const deadline = ref(props.initialDeadline);
const description = ref(props.initialDescription);
const selectedLearningPath = ref(props.initialLearningPath);
const selectedClass = ref(props.initialClass);
const groups = ref(props.initialGroups);
const allLearningPaths = ref([]);
const filteredLearningPaths = ref([]);
const allClasses = ref([]);

const availableClass = computed(() => selectedClass.value);
const allStudents = computed(() => selectedClass.value ? selectedClass.value.students : []);

const addGroupToList = (students: string[]) => {
    if (students.length) {
        groups.value = [...groups.value, students];
    }
};

async function fetchAllLearningPaths() {
    try {
        //TODO: replace by function from controller
        const response = await fetch(`http://localhost:3000/api/learningPath?language=${language.value}`);
        if (!response.ok) throw new Error("Failed to fetch learning paths");
        const data = await response.json();
        allLearningPaths.value = data.map((lp: { hruid: string; title: string }) => ({
            hruid: lp.hruid,
            name: lp.title
        }));
        filteredLearningPaths.value = [...allLearningPaths.value];
    } catch (error) {
        console.error(error);
    }
}

watch(() => locale.value, fetchAllLearningPaths, {immediate: true});
watch(selectedClass, () => groups.value = []);

const searchResults = computed(() => filteredLearningPaths.value.filter((lp) =>
    lp.title.toLowerCase().includes(searchQuery.value.toLowerCase())
));

onMounted(fetchAllLearningPaths);

const submitFormHandler = async () => {
    const {valid} = await form.value.validate();
    if (!valid) return;
    emit("submit", {
        assignmentTitle: assignmentTitle.value,
        selectedLearningPath: selectedLearningPath.value,
        selectedClass: selectedClass.value,
        groups: groups.value,
        deadline: deadline.value,
        description: description.value
    });
};
</script>

<template>
    <div class="main-container">
        <h1 class="title">{{ t(`${sort}-assignment`) }}</h1>
        <v-card class="form-card">
            <v-form ref="form" class="form-container" validate-on="submit lazy" @submit.prevent="submitFormHandler">
                <v-container class="step-container">
                    <v-card-text>
                        <v-text-field v-model="assignmentTitle" :label="t('title')" :rules="assignmentTitleRules"
                                      density="compact" variant="outlined" clearable required></v-text-field>
                    </v-card-text>

                    <v-card-text>
                        <v-combobox v-model="selectedLearningPath"
                                    :items="searchResults"
                                    item-title="name"
                                    item-value="hruid"
                                    :label="t('choose-lp')"
                                    :rules="learningPathRules"
                                    variant="outlined"
                                    clearable
                                    hide-details density="compact"
                                    append-inner-icon="mdi-magnify"
                                    required></v-combobox>
                    </v-card-text>

                    <v-card-text>
                        <v-combobox v-model="selectedClass"
                                    :items="allClasses"
                                    item-title="name"
                                    item-value="id"
                                    :label="t('pick-class')"
                                    :rules="classesRules"
                                    variant="outlined"
                                    clearable
                                    hide-details
                                    density="compact"
                                    append-inner-icon="mdi-magnify"
                                    required></v-combobox>
                    </v-card-text>

                    <DeadlineSelector v-model:deadline="deadline"/>

                    <h3>{{ t('create-groups') }}</h3>

                    <GroupSelector :students="allStudents"
                                   :availableClass="availableClass"
                                   :groups="groups"
                                   @groupCreated="addGroupToList"/>

                    <v-card-text v-if="groups.length">
                        <strong>Created Groups: {{ groups.length }}</strong>
                    </v-card-text>

                    <v-card-text>
                        <v-textarea v-model="description" :label="t('description')" variant="outlined" density="compact"
                                    auto-grow rows="3" :rules="descriptionRules"></v-textarea>
                    </v-card-text>

                    <v-btn class="mt-2" color="secondary" type="submit" block>Submit</v-btn>
                </v-container>
            </v-form>
        </v-card>
    </div>
</template>

<style scoped>
.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.title {
    margin-bottom: 1%;
}

.form-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 55%;
}

.form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.step-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    min-height: 200px;
}

@media (max-width: 1000px) {
    .form-card {
        width: 70%;
        padding: 1%;
    }
}

@media (max-width: 650px) {
    .form-card {
        width: 95%;
    }
}
</style>
