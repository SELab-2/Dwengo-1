/**
 * Service for all authentication- and authorization-related tasks.
 */

import { computed, reactive } from "vue";
import type { AuthState, Role, UserManagersForRoles } from "@/services/auth/auth.d.ts";
import { User, UserManager } from "oidc-client-ts";
import { loadAuthConfig } from "@/services/auth/auth-config-loader.ts";
import authStorage from "./auth-storage.ts";
import { loginRoute } from "@/config.ts";
import apiClient from "@/services/api-client.ts";
import router from "@/router";
import type { AxiosError } from "axios";

async function getUserManagers(): Promise<UserManagersForRoles> {
    const authConfig = await loadAuthConfig();
    return {
        student: new UserManager(authConfig.student),
        teacher: new UserManager(authConfig.teacher),
    };
}

/**
 * Information about the current authentication state.
 */
const authState = reactive<AuthState>({
    user: null,
    accessToken: null,
    activeRole: authStorage.getActiveRole() || null,
});

/**
 * Load the information about who is currently logged in from the IDP.
 */
async function loadUser(): Promise<User | null> {
    const activeRole = authStorage.getActiveRole();
    if (!activeRole) {
        return null;
    }
    const user = await (await getUserManagers())[activeRole].getUser();
    authState.user = user;
    authState.accessToken = user?.access_token || null;
    authState.activeRole = activeRole || null;
    return user;
}


const isLoggedIn = computed(() => authState.user !== null);

/**
 * Redirect the user to the login page where he/she can choose whether to log in as a student or teacher.
 */
async function initiateLogin() {
    await router.push(loginRoute);
}

/**
 * Redirect the user to the IDP for the given role so that he can log in there.
 * Only call this function when the user is not logged in yet!
 */
async function loginAs(role: Role): Promise<void> {
    // Storing it in local storage so that it won't be lost when redirecting outside of the app.
    authStorage.setActiveRole(role);
    await (await getUserManagers())[role].signinRedirect();
}

/**
 * To be called when the user is redirected to the callback-endpoint by the IDP after a successful login.
 */
async function handleLoginCallback(): Promise<void> {
    const activeRole = authStorage.getActiveRole();
    if (!activeRole) {
        throw new Error("Login callback received, but the user is not logging in!");
    }
    authState.user = (await (await getUserManagers())[activeRole].signinCallback()) || null;
}

/**
 * Refresh an expired authorization token.
 */
async function renewToken() {
    const activeRole = authStorage.getActiveRole();
    if (!activeRole) {
        console.log("Can't renew the token: Not logged in!");
        await initiateLogin();
        return;
    }
    try {
        return await (await getUserManagers())[activeRole].signinSilent();
    } catch (error) {
        console.log("Can't renew the token:");
        console.log(error);
        await initiateLogin();
    }
}

/**
 * End the session of the current user.
 */
async function logout(): Promise<void> {
    const activeRole = authStorage.getActiveRole();
    if (activeRole) {
        await (await getUserManagers())[activeRole].signoutRedirect();
        authStorage.deleteActiveRole();
    }
}

// Registering interceptor to add the authorization header to each request when the user is logged in.
apiClient.interceptors.request.use(
    async (reqConfig) => {
        const token = authState?.user?.access_token;
        if (token) {
            reqConfig.headers.Authorization = `Bearer ${token}`;
        }
        return reqConfig;
    },
    (error) => Promise.reject(error),
);

// Registering interceptor to refresh the token when a request failed because it was expired.
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string }>) => {
        if (error.response?.status === 401) {
            if (error.response!.data.message === "token_expired") {
                console.log("Access token expired, trying to refresh...");
                await renewToken();
                return apiClient(error.config!); // Retry the request
            } // Apparently, the user got a 401 because he was not logged in yet at all. Redirect him to login.
            await initiateLogin();
        }
        return Promise.reject(error);
    },
);

export default { authState, isLoggedIn, initiateLogin, loadUser, handleLoginCallback, loginAs, logout };
