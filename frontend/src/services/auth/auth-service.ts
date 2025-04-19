/**
 * Service for all authentication- and authorization-related tasks.
 */

import { computed, reactive } from "vue";
import type { AuthState, Role, UserManagersForRoles } from "@/services/auth/auth.d.ts";
import { User, UserManager } from "oidc-client-ts";
import { AUTH_CONFIG_ENDPOINT, loadAuthConfig } from "@/services/auth/auth-config-loader.ts";
import authStorage from "./auth-storage.ts";
import { loginRoute } from "@/config.ts";
import apiClient from "@/services/api-client/api-client.ts";
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
    activeRole: authStorage.getActiveRole() ?? null,
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
    setUserAuthInfo(user);
    authState.activeRole = activeRole ?? null;
    return user;
}

const isLoggedIn = computed(() => authState.user !== null);

/**
 * Clears all the cached information about the current authentication.
 */
function clearAuthState(): void {
    authStorage.deleteActiveRole();
    authState.accessToken = null;
    authState.user = null;
    authState.activeRole = null;
}

/**
 * Sets the information about the currently logged-in user in the cache.
 */
function setUserAuthInfo(newUser: User | null): void {
    authState.user = newUser;
    authState.accessToken = newUser?.access_token ?? null;
}

/**
 * Redirect the user to the login page where he/she can choose whether to log in as a student or teacher.
 */
async function initiateLogin(): Promise<void> {
    if (isLoggedIn.value) {
        clearAuthState();
    }
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
async function renewToken(): Promise<User | null> {
    const activeRole = authStorage.getActiveRole();
    if (!activeRole) {
        await initiateLogin();
        return null;
    }
    try {
        const userManagerForRole = (await getUserManagers())[activeRole];
        const user = await userManagerForRole.signinSilent();
        setUserAuthInfo(user);
    } catch (_error: unknown) {
        await initiateLogin();
    }
    return null;
}

/**
 * End the session of the current user.
 */
async function logout(): Promise<void> {
    const activeRole = authStorage.getActiveRole();
    if (activeRole) {
        await (await getUserManagers())[activeRole].signoutRedirect();
        authStorage.deleteActiveRole();
        clearAuthState();
    }
}

// Registering interceptor to add the authorization header to each request when the user is logged in.
apiClient.interceptors.request.use(
    async (reqConfig) => {
        const token = authState?.user?.access_token;
        if (token && reqConfig.url !== AUTH_CONFIG_ENDPOINT) {
            reqConfig.headers.Authorization = `Bearer ${token}`;
        }
        return reqConfig;
    },
    async (error) => Promise.reject(error),
);

// Registering interceptor to refresh the token when a request failed because it was expired.
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string, inner?: {message?: string} }>) => {
        if (error.response?.status === 401) {
            // If the user should already be logged in, his token is probably just expired.
            if (isLoggedIn.value) {
                await renewToken();
                return apiClient(error.config!); // Retry the request
            }

            // Apparently, the user got a 401 because he was not logged in yet at all. Redirect him to login.
            await initiateLogin();
        }
        return Promise.reject(error);
    },
);

export default { authState, isLoggedIn, initiateLogin, loadUser, handleLoginCallback, loginAs, logout };
