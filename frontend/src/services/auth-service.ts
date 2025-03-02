import {User, UserManager} from "oidc-client-ts";
import apiClient from "@/services/api-client.ts";

type FrontendAuthConfig = {
    student: FrontendIdpConfig,
    teacher: FrontendIdpConfig
}

type FrontendIdpConfig = {
    authority: string,
    clientId: string,
    scope: string,
    responseType: string
}

export type Role = "student" | "teacher";
type UserManagersForRoles = {student: UserManager, teacher: UserManager};

class AuthService {
    constructor(private userManagers: UserManagersForRoles) {}

    public async loginAs(role: Role) {
        // Storing it in local storage so that it won't be lost when redirecting outside of the app.
        this.setActiveRole(role);
        await this.userManagers[role].signinRedirect();
    }

    public async logout() {
        const activeRole = this.getActiveRole();
        if (activeRole) {
            await this.userManagers[activeRole].signoutRedirect();
            this.deleteActiveRole();
        }
    }

    public async getUser(): Promise<User | null> {
        const activeRole = this.getActiveRole();
        if (!activeRole) {
            return null;
        }
        return await this.userManagers[activeRole].getUser();
    }

    public async getAccessToken(): Promise<string | null> {
        const user = await this.getUser();
        return user?.access_token || null;
    }

    async renewToken() {
        const activeRole = this.getActiveRole();
        if (!activeRole) {
            throw new Error("Can't renew the token: Not logged in!");
        }
        return this.userManagers[activeRole].signinSilent();
    }

    public getActiveRole(): Role | undefined {
        return localStorage.getItem("activeRole") as Role | undefined;
    }

    public async handleRedirectCallback(): Promise<User | undefined> {
        const activeRole = this.getActiveRole();
        if (!activeRole) {
            throw new Error("Can't renew the token: Not logged in!");
        }
        return this.userManagers[activeRole].signinCallback();
    }

    private setActiveRole(role: Role) {
        localStorage.setItem("activeRole", role);
    }

    private deleteActiveRole() {
        localStorage.removeItem("activeRole");
    }
}

async function initAuthService() {
    const authConfig = await apiClient.get<FrontendAuthConfig>("auth/config").then(it => it.data);

    const oidcConfig = {
        student: {
            authority: authConfig.student.authority,
            client_id: authConfig.student.clientId,
            redirect_uri: window.location.origin + "/callback",
            response_type: authConfig.student.responseType,
            scope: authConfig.student.scope,
            post_logout_redirect_uri: window.location.origin,
        },
        teacher: {
            authority: authConfig.teacher.authority,
            client_id: authConfig.teacher.clientId,
            redirect_uri: window.location.origin + "/callback",
            response_type: authConfig.teacher.responseType,
            scope: authConfig.teacher.scope,
            post_logout_redirect_uri: window.location.origin,
        }
    };

    return new AuthService({
        student: new UserManager(oidcConfig.student),
        teacher: new UserManager(oidcConfig.teacher)
    });
}

export default await initAuthService();
