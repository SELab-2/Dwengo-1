import {computed, reactive} from "vue";
import authService, {type Role} from "@/services/auth-service.ts";
import type {User} from "oidc-client-ts";

type AuthState = {
    user: User | null,
    accessToken: string | null,
    activeRole: Role | null
};

export const authState = reactive<AuthState>({
    user: null,
    accessToken: null,
    activeRole: authService.getActiveRole() || null
});

export const isLoggedIn = computed(() => authState.user !== null);

export async function loadUser(): Promise<void> {
    const user = await authService.getUser();
    authState.user = user;
    authState.accessToken = user?.access_token || null;
    authState.activeRole = authService.getActiveRole() || null;
}

export async function handleLoginCallback(): Promise<void> {
    console.log("Hallooo");
    authState.user = await authService.handleRedirectCallback() || null;
}

export async function loginAs(role: Role): Promise<void> {
    await authService.loginAs(role);
}

export async function logout(): Promise<void> {
    await authService.logout();
    authState.user = null;
    authState.accessToken = null;
    authState.activeRole = null;
}
