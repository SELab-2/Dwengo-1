<script setup lang="ts">
    import { useI18n } from "vue-i18n";

    const props = defineProps<{
        text: string;
        prependIcon?: string;
        appendIcon?: string;
        confirmQueryText: string;
        variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain" | undefined;
        color?: string;
        disabled?: boolean;
    }>();

    const emit = defineEmits<{ (e: "confirm"): void }>();

    const { t } = useI18n();

    function confirm(): void {
        emit("confirm");
    }
</script>

<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                :text="props.text"
                :prependIcon="props.prependIcon"
                :appendIcon="props.appendIcon"
                :variant="props.variant"
                :color="color"
                :disabled="props.disabled"
            ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card :title="t('confirmDialogTitle')">
                <v-card-text>
                    {{ props.confirmQueryText }}
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        :text="t('yes')"
                        @click="
                            confirm();
                            isActive.value = false;
                        "
                    ></v-btn>
                    <v-btn
                        :text="t('cancel')"
                        @click="isActive.value = false"
                    ></v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped></style>
