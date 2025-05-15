<script setup lang="ts">
    import { useRouter } from "vue-router";
    import { useI18n } from "vue-i18n";
    import { onMounted, ref, type Ref } from "vue";
    import auth from "../services/auth/auth-service.ts";
    import { Redirect } from "@/utils/redirect.ts";

    const { t } = useI18n();

    const router = useRouter();

    const errorMessage: Ref<string | null> = ref(null);

    async function redirectPage(): Promise<void> {
        const redirectUrl = localStorage.getItem(Redirect.AFTER_LOGIN_KEY);
        if (redirectUrl) {
            localStorage.removeItem(Redirect.AFTER_LOGIN_KEY);
            await router.replace(redirectUrl);
        } else {
            await router.replace(Redirect.HOME);
        }
    }

    onMounted(async () => {
        try {
            await auth.handleLoginCallback();
            await redirectPage();
        } catch (error) {
            errorMessage.value = `${t("loginUnexpectedError")}: ${error}`;
        }
    });
</script>

<template>
    <div class="callback">
        <div
            class="callback-loading"
            v-if="!errorMessage"
        >
            <v-progress-circular indeterminate></v-progress-circular>
            <p>{{ t("callbackLoading") }}</p>
        </div>
        <v-alert
            icon="mdi-alert-circle"
            type="error"
            variant="elevated"
            v-if="errorMessage"
        >
            {{ errorMessage }}
        </v-alert>
    </div>
</template>

<style scoped>
    .callback {
        text-align: center;
        margin: 20px;
    }
</style>
