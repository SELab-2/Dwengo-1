<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import { ref } from "vue";
    const { t } = useI18n();

    const step = ref(1);

</script>

<template>
    <div class="main-container">
        <h1 class="title">{{ t("new-assignment") }}</h1>
        <v-card class="form-card">
            <v-stepper class="stepper-container" alt-labels :items="['Learning path', 'Classes', 'Groups']" v-model="step" show-actions>
                <template v-slot:item.1>
                    <v-card title="Step One" flat>

                    </v-card>
                </template>

                <template>
                    <v-card title="Step Two" flat>
                        <v-container class="step-container">
                            <!-- Content for Step Two -->
                        </v-container>
                    </v-card>
                </template>

                <template>
                    <v-card title="Step Three" flat>
                        <v-container class="step-container">
                            <!-- Content for Step Three -->
                        </v-container>
                    </v-card>
                </template>
            </v-stepper>
        </v-card>
    </div>
</template>

<style scoped>
.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
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
    width: 70%;
    padding: 1%;
}

.stepper-container {
    width: 100%;
}

.step-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .form-card {
        width: 95%;
        padding: 1%;
    }

    .v-stepper-header {
        display: none; /* Hides step numbers on small screens */
    }

    .step-container {
        min-height: 300px; /* Gives enough space */
    }
}
</style>
