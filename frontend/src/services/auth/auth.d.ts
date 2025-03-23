import { type User, UserManager } from "oidc-client-ts";

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    activeRole: Role | null;
}

export interface FrontendAuthConfig {
    student: FrontendIdpConfig;
    teacher: FrontendIdpConfig;
}

export interface FrontendIdpConfig {
    authority: string;
    clientId: string;
    scope: string;
    responseType: string;
}

export type Role = "student" | "teacher";
export interface UserManagersForRoles { student: UserManager; teacher: UserManager }
