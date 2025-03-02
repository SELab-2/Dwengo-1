/**
 * Service for all authentication- and authorization-related tasks.
 */

import {computed, reactive} from "vue";
import type {AuthState, Role, UserManagersForRoles} from "@/services/auth/auth-types.ts";
import {User, UserManager} from "oidc-client-ts";
import {loadAuthConfig} from "@/services/auth/auth-config-loader.ts";
import {configureApiClientAuthInterceptors} from "@/services/auth/auth-api-client-interceptors.ts";
import authStorage from "./auth-storage.ts"

const authConfig = await loadAuthConfig();

const userManagers: UserManagersForRoles = {
    student: new UserManager(authConfig.student),
    teacher: new UserManager(authConfig.teacher),
};

async function loadUser(): Promise<User | null> {
    const activeRole = authStorage.getActiveRole();
    if (!activeRole) {
        return null;
    }
    let user = await userManagers[activeRole].getUser();
    authState.user = user;
    authState.accessToken = user?.access_token || null;
    authState.activeRole = activeRole || null;
    return user;
}

const authState = reactive<AuthState>({
    user: null,
    accessToken: null,
    activeRole: authStorage.getActiveRole() || null
});

const isLoggedIn = computed(() => authState.user !== null);

async function loginAs(role: Role): Promise<void> {
    // Storing it in local storage so that it won't be lost when redirecting outside of the app.
    authStorage.setActiveRole(role);
    await userManagers[role].signinRedirect();
}

async function handleLoginCallback(): Promise<void> {
    const activeRole = authStorage.getActiveRole();
    if (!activeRole) {
        throw new Error("Can't renew the token: Not logged in!");
    }
    authState.user = await userManagers[activeRole].signinCallback() || null;
}

async function renewToken() {
    const activeRole = authStorage.getActiveRole();
    if (!activeRole) {
        throw new Error("Can't renew the token: Not logged in!");
    }
    try {
        return await userManagers[activeRole].signinSilent();
    } catch (error) {
        console.log("Can't renew the token:");
        console.log(error);
        await loginAs(activeRole);
    }
}

async function logout(): Promise<void> {
    const activeRole = authStorage.getActiveRole();
    if (activeRole) {
        await userManagers[activeRole].signoutRedirect();
        authStorage.deleteActiveRole();
    }
}

configureApiClientAuthInterceptors(authState, renewToken);

export default {authState, isLoggedIn, loadUser, handleLoginCallback, loginAs, logout};
